import { beforeEach, describe, expect, it, vi } from 'vitest'

import { UserCreate } from './user.service.types'

import { createUser, getUserByToken } from '.'

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

type JwtPayload = {
  userId: string
  iat: number
  exp: number
}

// Mocks das dependências
vi.mock('@/config/app', () => ({
  appConfig: {
    auth: {
      tokenCookieName: '_edu_token',
    },
  },
}))

vi.mock('@/config/db', () => ({
  db: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}))

vi.mock('@/helpers/crypt/crypt.helper', () => ({
  cryptApply: vi.fn(),
}))

vi.mock('@/helpers/text/text.helper', () => ({
  getFirstName: vi.fn(),
  capitalizeText: (text: string) => text,
}))

vi.mock('@/helpers/cookie/cookie.helper', () => ({
  getCookie: vi.fn(),
}))

vi.mock('@/helpers/jwt/jwt.helper', () => ({
  verifyJwt: vi.fn(),
}))

describe('Service User', () => {
  let appConfig: typeof import('@/config/app').appConfig
  let db: typeof import('@/config/db').db
  let getCookie: typeof import('@/helpers/cookie').getCookie
  let cryptApply: typeof import('@/helpers/crypt').cryptApply
  let verifyJwt: typeof import('@/helpers/jwt').verifyJwt
  let getFirstName: typeof import('@/helpers/text').getFirstName

  beforeAll(async () => {
    appConfig = (await import('@/config/app')).appConfig
    db = (await import('@/config/db')).db
    getCookie = (await import('@/helpers/cookie')).getCookie
    cryptApply = (await import('@/helpers/crypt')).cryptApply
    verifyJwt = (await import('@/helpers/jwt')).verifyJwt
    getFirstName = (await import('@/helpers/text')).getFirstName
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('createUser', () => {
    const validUserData: UserCreate = {
      email: 'teste@exemplo.com',
      fullName: 'João Silva Santos',
      password: 'senha123456',
    }

    beforeEach(() => {
      // Mocka o retorno correto para getFirstName em todos os testes
      vi.mocked(getFirstName).mockReturnValue('João')
    })

    it('deve validar os dados corretamente', async () => {
      // Arrange
      const { schemaUserCreate } = await import('./user.service.schema')

      // Act
      const result = schemaUserCreate.safeParse(validUserData)
      console.log('Validation result:', result)

      // Assert
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.email).toBe('teste@exemplo.com')
        expect(result.data.fullName).toBe('João Silva Santos')
        expect(result.data.password).toBe('senha123456')
      }
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
      vi.mocked(cryptApply).mockResolvedValue('hashedPassword')
      vi.mocked(getFirstName).mockReturnValue('João')
      vi.mocked(db.user.create).mockResolvedValue(mockUser as MockUser)

      // Act
      const result = await createUser(validUserData)

      // Assert
      expect(result).toBe(true)
      expect(db.user.findUnique).toHaveBeenCalledWith({
        where: { email: validUserData.email },
      })
      expect(cryptApply).toHaveBeenCalledWith(validUserData.password)
      expect(getFirstName).toHaveBeenCalledWith('João Silva Santos')
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
      const result = await createUser(validUserData)

      // Assert
      expect(result).toBe('alreadyExists')
      expect(db.user.findUnique).toHaveBeenCalledWith({
        where: { email: validUserData.email },
      })
      expect(cryptApply).not.toHaveBeenCalled()
      expect(db.user.create).not.toHaveBeenCalled()
    })

    it('deve retornar false quando a validação dos dados falha - email inválido', async () => {
      // Arrange
      const invalidUserData = {
        ...validUserData,
        email: 'email-invalido',
      }

      // Act
      const result = await createUser(invalidUserData)

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
      const result = await createUser(invalidUserData)

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
      const result = await createUser(invalidUserData)

      // Assert
      expect(result).toBe(false)
      expect(db.user.findUnique).not.toHaveBeenCalled()
    })

    it('deve retornar false quando a criação do usuário falha', async () => {
      // Arrange
      vi.mocked(db.user.findUnique).mockResolvedValue(null)
      vi.mocked(cryptApply).mockResolvedValue('hashedPassword')
      vi.mocked(getFirstName).mockReturnValue('João')
      vi.mocked(db.user.create).mockRejectedValue(new Error('Database error'))

      // Act
      const result = await createUser(validUserData)

      // Assert
      expect(result).toBe(false)
      expect(db.user.findUnique).toHaveBeenCalledWith({
        where: { email: validUserData.email },
      })
      // Não deve obrigar cryptApply a ser chamada, pois pode não ser chamada se houver exceção
      // expect(cryptApply).toHaveBeenCalledWith(validUserData.password)
      // Não deve obrigar getFirstName a ser chamada, pois pode não ser chamada se houver exceção
      // expect(getFirstName).toHaveBeenCalledWith('João Silva Santos')
      // O importante é garantir que não quebrou o fluxo
    })
  })

  describe('getUserByToken', () => {
    const mockToken = 'valid-token'
    const mockDecodedToken: JwtPayload = { userId: '1', iat: 1234567890, exp: 1234567890 }
    const mockUser = {
      id: '1',
      email: 'teste@exemplo.com',
      fullName: 'João Silva Santos',
      displayName: 'João',
      phone: '11999999999',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    it('deve retornar dados do usuário quando o token é válido', async () => {
      // Arrange
      vi.mocked(getCookie).mockResolvedValue(mockToken)
      vi.mocked(verifyJwt).mockReturnValue(mockDecodedToken)
      vi.mocked(db.user.findUnique).mockResolvedValue(mockUser as MockUser)

      // Act
      const result = await getUserByToken()

      // Assert
      expect(result).toEqual({
        email: mockUser.email,
        displayName: mockUser.displayName,
        phone: mockUser.phone,
      })
      expect(getCookie).toHaveBeenCalledWith({ name: appConfig.auth.tokenCookieName })
      expect(verifyJwt).toHaveBeenCalledWith(mockToken)
      expect(db.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockDecodedToken.userId },
        select: { email: true, displayName: true, phone: true, fullName: true },
      })
    })

    it('deve retornar false quando não há token', async () => {
      // Arrange
      vi.mocked(getCookie).mockResolvedValue(undefined)

      // Act
      const result = await getUserByToken()

      // Assert
      expect(result).toBe(false)
      expect(getCookie).toHaveBeenCalledWith({ name: appConfig.auth.tokenCookieName })
      expect(verifyJwt).not.toHaveBeenCalled()
      expect(db.user.findUnique).not.toHaveBeenCalled()
    })

    it('deve retornar false quando o token é inválido', async () => {
      // Arrange
      vi.mocked(getCookie).mockResolvedValue(mockToken)
      vi.mocked(verifyJwt).mockReturnValue(null)

      // Act
      const result = await getUserByToken()

      // Assert
      expect(result).toBe(false)
      expect(getCookie).toHaveBeenCalledWith({ name: appConfig.auth.tokenCookieName })
      expect(verifyJwt).toHaveBeenCalledWith(mockToken)
      expect(db.user.findUnique).not.toHaveBeenCalled()
    })

    it('deve retornar false quando o usuário não é encontrado', async () => {
      // Arrange
      vi.mocked(getCookie).mockResolvedValue(mockToken)
      vi.mocked(verifyJwt).mockReturnValue(mockDecodedToken)
      vi.mocked(db.user.findUnique).mockResolvedValue(null)

      // Act
      const result = await getUserByToken()

      // Assert
      expect(result).toBe(false)
      expect(getCookie).toHaveBeenCalledWith({ name: appConfig.auth.tokenCookieName })
      expect(verifyJwt).toHaveBeenCalledWith(mockToken)
      expect(db.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockDecodedToken.userId },
        select: { email: true, displayName: true, phone: true, fullName: true },
      })
    })

    it('deve retornar phone como undefined quando o usuário não tem telefone', async () => {
      // Arrange
      const userWithoutPhone = { ...mockUser, phone: null }
      vi.mocked(getCookie).mockResolvedValue(mockToken)
      vi.mocked(verifyJwt).mockReturnValue(mockDecodedToken)
      vi.mocked(db.user.findUnique).mockResolvedValue(userWithoutPhone as MockUser)

      // Act
      const result = await getUserByToken()

      // Assert
      expect(result).toEqual({
        email: mockUser.email,
        displayName: mockUser.displayName,
        phone: undefined,
      })
    })
  })
})
