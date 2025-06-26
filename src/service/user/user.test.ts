/**
 * Testes para o serviço de usuário
 *
 * Este arquivo contém testes unitários para todas as funções do serviço de usuário:
 * - serviceUserCreate: Testa a criação de usuários
 * - serviceUserGetByToken: Testa a busca de usuário por token
 *
 * Cobertura de testes:
 * - Casos de sucesso
 * - Validação de dados inválidos
 * - Casos de erro (usuário já existe, token inválido, etc.)
 * - Mocks de dependências externas
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { serviceUserCreate, serviceUserGetByToken } from './service'
import { UserCreate, UserGetByToken } from './types'

// Tipos para os mocks - baseados no schema do Prisma
type MockUser = {
  id: string
  email: string
  password: string
  fullName: string
  displayName: string
  phone: string | null
  createdAt: Date
  updatedAt: Date
}

type MockUserSession = Pick<MockUser, 'email' | 'displayName' | 'phone' | 'fullName'>

// Mocks das dependências
vi.mock('@/lib/db', () => ({
  db: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}))

vi.mock('@/helpers/pwd', () => ({
  pwdCrypt: vi.fn(),
}))

vi.mock('@/helpers/text', () => ({
  textFirstName: vi.fn(),
  textCapitalize: vi.fn(),
}))

vi.mock('@/helpers/cookie', () => ({
  cookieGet: vi.fn(),
}))

vi.mock('@/helpers/jwt', () => ({
  jwtVerify: vi.fn(),
}))

import { db } from '@/lib/db'
import { pwdCrypt } from '@/helpers/pwd'
import { textFirstName, textCapitalize } from '@/helpers/text'
import { cookieGet } from '@/helpers/cookie'
import { jwtVerify } from '@/helpers/jwt'

// Adiciona mock global para textCapitalize
vi.mocked(textCapitalize).mockImplementation((name: string) =>
  name
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' '),
)

describe('Service User', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('serviceUserCreate', () => {
    const validUserData: UserCreate = {
      email: 'teste@exemplo.com',
      fullName: 'João Silva Santos',
      password: 'senha123456',
    }

    beforeEach(() => {
      // Mocka o retorno correto para textFirstName em todos os testes
      vi.mocked(textFirstName).mockReturnValue('João')
    })

    it('deve criar um usuário com sucesso', async () => {
      // Arrange
      const mockUser = {
        id: '1',
        email: validUserData.email,
        fullName: 'João Silva Santos',
        displayName: 'João',
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        phone: null,
      }

      vi.mocked(db.user.findUnique).mockResolvedValue(null)
      vi.mocked(pwdCrypt).mockResolvedValue('hashedPassword')
      vi.mocked(textFirstName).mockReturnValue('João')
      vi.mocked(db.user.create).mockResolvedValue(mockUser as MockUser)

      // Act
      const result = await serviceUserCreate(validUserData)

      // Assert
      expect(result).toBe(true)
      expect(db.user.findUnique).toHaveBeenCalledWith({
        where: { email: validUserData.email },
      })
      expect(pwdCrypt).toHaveBeenCalledWith(validUserData.password)
      expect(textFirstName).toHaveBeenCalledWith('João Silva Santos')
      expect(db.user.create).toHaveBeenCalledWith({
        data: {
          email: validUserData.email,
          fullName: 'João Silva Santos',
          displayName: 'João',
          password: 'hashedPassword',
        },
      })
    })

    it('deve retornar "alreadyExists" quando o usuário já existe', async () => {
      // Arrange
      const existingUser: MockUser = {
        id: '1',
        email: validUserData.email,
        fullName: 'João Silva',
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        displayName: 'João',
        phone: null,
      }

      vi.mocked(db.user.findUnique).mockResolvedValue(existingUser)

      // Act
      const result = await serviceUserCreate(validUserData)

      // Assert
      expect(result).toBe('alreadyExists')
      expect(db.user.findUnique).toHaveBeenCalledWith({
        where: { email: validUserData.email },
      })
      expect(pwdCrypt).not.toHaveBeenCalled()
      expect(db.user.create).not.toHaveBeenCalled()
    })

    it('deve retornar false quando a validação dos dados falha - email inválido', async () => {
      // Arrange
      const invalidUserData = {
        ...validUserData,
        email: 'email-invalido',
      }

      // Act
      const result = await serviceUserCreate(invalidUserData)

      // Assert
      expect(result).toBe(false)
      expect(db.user.findUnique).not.toHaveBeenCalled()
    })

    it('deve retornar false quando a validação dos dados falha - nome muito curto', async () => {
      // Arrange
      const invalidUserData = {
        ...validUserData,
        fullName: 'Jo',
      }

      // Act
      const result = await serviceUserCreate(invalidUserData)

      // Assert
      expect(result).toBe(false)
      expect(db.user.findUnique).not.toHaveBeenCalled()
    })

    it('deve retornar false quando a validação dos dados falha - senha muito curta', async () => {
      // Arrange
      const invalidUserData = {
        ...validUserData,
        password: '123',
      }

      // Act
      const result = await serviceUserCreate(invalidUserData)

      // Assert
      expect(result).toBe(false)
      expect(db.user.findUnique).not.toHaveBeenCalled()
    })

    it('deve retornar false quando a validação dos dados falha - nome sem sobrenome', async () => {
      // Arrange
      const invalidUserData = {
        ...validUserData,
        fullName: 'João',
      }

      // Act
      const result = await serviceUserCreate(invalidUserData)

      // Assert
      expect(result).toBe(false)
      expect(db.user.findUnique).not.toHaveBeenCalled()
    })

    it('deve retornar false quando a criação do usuário no banco falha', async () => {
      // Arrange
      vi.mocked(db.user.findUnique).mockResolvedValue(null)
      vi.mocked(pwdCrypt).mockResolvedValue('hashedPassword')
      vi.mocked(textFirstName).mockReturnValue('João')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(db.user.create).mockResolvedValue(null as any)

      // Act
      const result = await serviceUserCreate(validUserData)

      // Assert
      expect(result).toBe(false)
      expect(db.user.create).toHaveBeenCalled()
    })

    it('deve processar transformações de dados corretamente', async () => {
      // Arrange
      const userDataWithTransforms: UserCreate = {
        email: '  TESTE@EXEMPLO.COM  ',
        fullName: '  joão silva santos  ',
        password: '  senha123456  ',
      }

      const mockUser: MockUser = {
        id: '1',
        email: 'teste@exemplo.com',
        fullName: 'João Silva Santos',
        displayName: 'João',
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        phone: null,
      }

      // Mocka o valor esperado para o nome capitalizado
      vi.mocked(textCapitalize).mockReturnValue('João Silva Santos')
      vi.mocked(db.user.findUnique).mockResolvedValue(null)
      vi.mocked(pwdCrypt).mockResolvedValue('hashedPassword')
      vi.mocked(textFirstName).mockReturnValue('João')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(db.user.create).mockResolvedValue(mockUser as any)

      // Act
      const result = await serviceUserCreate(userDataWithTransforms)

      // Assert
      expect(result).toBe(true)
      expect(db.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'teste@exemplo.com' },
      })
      expect(textFirstName).toHaveBeenCalledWith('João Silva Santos')
      expect(db.user.create).toHaveBeenCalledWith({
        data: {
          email: 'teste@exemplo.com',
          fullName: 'João Silva Santos',
          displayName: 'João',
          password: 'hashedPassword',
        },
      })
    })
  })

  describe('serviceUserGetByToken', () => {
    const validParams: UserGetByToken = undefined

    it('deve retornar dados do usuário com sucesso', async () => {
      // Arrange
      const mockToken = 'valid-jwt-token'
      const mockDecoded = { userId: '1' }
      const mockUser: MockUserSession = {
        email: 'teste@exemplo.com',
        displayName: 'João',
        phone: '11999999999',
        fullName: 'João Silva Santos',
      }

      vi.mocked(cookieGet).mockResolvedValue(mockToken)
      vi.mocked(jwtVerify).mockReturnValue(mockDecoded)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(db.user.findUnique).mockResolvedValue(mockUser as any)

      // Act
      const result = await serviceUserGetByToken(validParams)

      // Assert
      expect(result).toEqual({
        email: mockUser.email,
        displayName: mockUser.displayName,
        phone: mockUser.phone,
      })
      expect(cookieGet).toHaveBeenCalledWith({ name: 'token' })
      expect(jwtVerify).toHaveBeenCalledWith(mockToken)
      expect(db.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockDecoded.userId },
        select: { email: true, displayName: true, phone: true, fullName: true },
      })
    })

    it('deve retornar dados do usuário sem telefone quando phone é null', async () => {
      // Arrange
      const mockToken = 'valid-jwt-token'
      const mockDecoded = { userId: '1' }
      const mockUser: MockUserSession = {
        email: 'teste@exemplo.com',
        displayName: 'João',
        phone: null,
        fullName: 'João Silva Santos',
      }

      vi.mocked(cookieGet).mockResolvedValue(mockToken)
      vi.mocked(jwtVerify).mockReturnValue(mockDecoded)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(db.user.findUnique).mockResolvedValue(mockUser as any)

      // Act
      const result = await serviceUserGetByToken(validParams)

      // Assert
      expect(result).toEqual({
        email: mockUser.email,
        displayName: mockUser.displayName,
        phone: undefined,
      })
    })

    it('deve retornar false quando não há token no cookie', async () => {
      // Arrange
      vi.mocked(cookieGet).mockResolvedValue(undefined)

      // Act
      const result = await serviceUserGetByToken(validParams)

      // Assert
      expect(result).toBe(false)
      expect(cookieGet).toHaveBeenCalledWith({ name: 'token' })
      expect(jwtVerify).not.toHaveBeenCalled()
      expect(db.user.findUnique).not.toHaveBeenCalled()
    })

    it('deve retornar false quando o token é inválido', async () => {
      // Arrange
      const mockToken = 'invalid-jwt-token'

      vi.mocked(cookieGet).mockResolvedValue(mockToken)
      vi.mocked(jwtVerify).mockReturnValue(null)

      // Act
      const result = await serviceUserGetByToken(validParams)

      // Assert
      expect(result).toBe(false)
      expect(cookieGet).toHaveBeenCalledWith({ name: 'token' })
      expect(jwtVerify).toHaveBeenCalledWith(mockToken)
      expect(db.user.findUnique).not.toHaveBeenCalled()
    })

    it('deve retornar false quando o usuário não existe no banco', async () => {
      // Arrange
      const mockToken = 'valid-jwt-token'
      const mockDecoded = { userId: '999' }

      vi.mocked(cookieGet).mockResolvedValue(mockToken)
      vi.mocked(jwtVerify).mockReturnValue(mockDecoded)
      vi.mocked(db.user.findUnique).mockResolvedValue(null)

      // Act
      const result = await serviceUserGetByToken(validParams)

      // Assert
      expect(result).toBe(false)
      expect(db.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockDecoded.userId },
        select: { email: true, displayName: true, phone: true, fullName: true },
      })
    })

    it('deve retornar false quando a validação dos parâmetros falha', async () => {
      // Arrange - Simulando parâmetros inválidos (embora seja undefined)
      // Como o schema é z.undefined(), qualquer valor diferente de undefined falhará
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const invalidParams = { invalidProp: 'test' } as any

      // Act
      const result = await serviceUserGetByToken(invalidParams)

      // Assert
      expect(result).toBe(false)
      expect(cookieGet).not.toHaveBeenCalled()
    })
  })
})
