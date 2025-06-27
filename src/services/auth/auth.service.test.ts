import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AuthLogin } from './auth.service.types'

import { authenticateUser, logoutUser, verifyUserToken } from '.'

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
      isProduction: false,
    },
  },
}))

vi.mock('@/config/db', () => ({
  db: {
    user: {
      findUnique: vi.fn(),
    },
  },
}))

vi.mock('@/helpers/cookie', () => ({
  setCookie: vi.fn(),
  deleteCookie: vi.fn(),
  getCookie: vi.fn(),
}))

vi.mock('@/helpers/crypt', () => ({
  verifyCrypt: vi.fn(),
}))

vi.mock('@/helpers/jwt', () => ({
  signJwt: vi.fn(),
  verifyJwt: vi.fn(),
}))

// Importar dos mocks
const { appConfig } = await import('@/config/app')
const { db } = await import('@/config/db')
const { setCookie, deleteCookie, getCookie } = await import('@/helpers/cookie')
const { verifyCrypt } = await import('@/helpers/crypt')
const { signJwt, verifyJwt } = await import('@/helpers/jwt')

describe('Service Auth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('authenticateUser', () => {
    const validCredentials: AuthLogin = {
      email: 'teste@exemplo.com',
      password: 'senha123456',
    }

    const mockUser: MockUser = {
      id: '1',
      email: 'teste@exemplo.com',
      password: 'hashedPassword',
      fullName: 'João Silva',
      displayName: 'João',
      phone: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    describe('quando receber credenciais válidas', () => {
      it('deve autenticar usuário com sucesso quando email e senha estão corretos', async () => {
        // Arrange
        vi.mocked(db.user.findUnique).mockResolvedValue(mockUser)
        vi.mocked(verifyCrypt).mockResolvedValue(true)
        vi.mocked(signJwt).mockReturnValue('valid-jwt-token')
        vi.mocked(setCookie).mockResolvedValue()

        // Act
        const result = await authenticateUser(validCredentials)

        // Assert
        expect(result).toEqual({ success: true })
        expect(db.user.findUnique).toHaveBeenCalledWith({
          where: { email: validCredentials.email },
        })
        expect(verifyCrypt).toHaveBeenCalledWith(validCredentials.password, mockUser.password)
        expect(signJwt).toHaveBeenCalledWith({ userId: mockUser.id })
        expect(setCookie).toHaveBeenCalledWith({
          name: appConfig.auth.tokenCookieName,
          value: 'valid-jwt-token',
          options: {
            maxAge: 60 * 60 * 24 * 30,
            httpOnly: true,
            path: '/',
            secure: appConfig.auth.isProduction,
          },
        })
      })
    })

    describe('quando receber credenciais inválidas', () => {
      it('deve retornar erro de validação quando email tem formato inválido', async () => {
        // Arrange
        const invalidCredentials = {
          ...validCredentials,
          email: 'email-invalido',
        }

        // Act
        const result = await authenticateUser(invalidCredentials)

        // Assert
        expect(result).toEqual({ success: false, error: 'validationError' })
        expect(db.user.findUnique).not.toHaveBeenCalled()
        expect(verifyCrypt).not.toHaveBeenCalled()
        expect(signJwt).not.toHaveBeenCalled()
        expect(setCookie).not.toHaveBeenCalled()
      })

      it('deve retornar erro de validação quando senha tem menos de 8 caracteres', async () => {
        // Arrange
        const invalidCredentials = {
          ...validCredentials,
          password: '123',
        }

        // Act
        const result = await authenticateUser(invalidCredentials)

        // Assert
        expect(result).toEqual({ success: false, error: 'validationError' })
        expect(db.user.findUnique).not.toHaveBeenCalled()
        expect(verifyCrypt).not.toHaveBeenCalled()
        expect(signJwt).not.toHaveBeenCalled()
        expect(setCookie).not.toHaveBeenCalled()
      })

      it('deve retornar erro de validação quando email está vazio', async () => {
        // Arrange
        const invalidCredentials = {
          ...validCredentials,
          email: '',
        }

        // Act
        const result = await authenticateUser(invalidCredentials)

        // Assert
        expect(result).toEqual({ success: false, error: 'validationError' })
        expect(db.user.findUnique).not.toHaveBeenCalled()
        expect(verifyCrypt).not.toHaveBeenCalled()
        expect(signJwt).not.toHaveBeenCalled()
        expect(setCookie).not.toHaveBeenCalled()
      })

      it('deve retornar erro de validação quando senha está vazia', async () => {
        // Arrange
        const invalidCredentials = {
          ...validCredentials,
          password: '',
        }

        // Act
        const result = await authenticateUser(invalidCredentials)

        // Assert
        expect(result).toEqual({ success: false, error: 'validationError' })
        expect(db.user.findUnique).not.toHaveBeenCalled()
        expect(verifyCrypt).not.toHaveBeenCalled()
        expect(signJwt).not.toHaveBeenCalled()
        expect(setCookie).not.toHaveBeenCalled()
      })
    })

    describe('quando usuário não existe no banco', () => {
      it('deve retornar erro de credenciais inválidas quando email não está cadastrado', async () => {
        // Arrange
        vi.mocked(db.user.findUnique).mockResolvedValue(null)

        // Act
        const result = await authenticateUser(validCredentials)

        // Assert
        expect(result).toEqual({ success: false, error: 'invalidCredentials' })
        expect(db.user.findUnique).toHaveBeenCalledWith({
          where: { email: validCredentials.email },
        })
        expect(verifyCrypt).not.toHaveBeenCalled()
        expect(signJwt).not.toHaveBeenCalled()
        expect(setCookie).not.toHaveBeenCalled()
      })
    })

    describe('quando senha está incorreta', () => {
      it('deve retornar erro de credenciais inválidas quando senha não confere', async () => {
        // Arrange
        vi.mocked(db.user.findUnique).mockResolvedValue(mockUser)
        vi.mocked(verifyCrypt).mockResolvedValue(false)

        // Act
        const result = await authenticateUser(validCredentials)

        // Assert
        expect(result).toEqual({ success: false, error: 'invalidCredentials' })
        expect(db.user.findUnique).toHaveBeenCalledWith({
          where: { email: validCredentials.email },
        })
        expect(verifyCrypt).toHaveBeenCalledWith(validCredentials.password, mockUser.password)
        expect(signJwt).not.toHaveBeenCalled()
        expect(setCookie).not.toHaveBeenCalled()
      })
    })

    describe('quando ocorrem erros durante o processo', () => {
      it('deve propagar erro quando setCookie falha', async () => {
        // Arrange
        vi.mocked(db.user.findUnique).mockResolvedValue(mockUser)
        vi.mocked(verifyCrypt).mockResolvedValue(true)
        vi.mocked(signJwt).mockReturnValue('valid-jwt-token')
        vi.mocked(setCookie).mockRejectedValue(new Error('Cookie error'))

        // Act & Assert
        await expect(authenticateUser(validCredentials)).rejects.toThrow('Cookie error')
        expect(db.user.findUnique).toHaveBeenCalledWith({
          where: { email: validCredentials.email },
        })
        expect(verifyCrypt).toHaveBeenCalledWith(validCredentials.password, mockUser.password)
        expect(signJwt).toHaveBeenCalledWith({ userId: mockUser.id })
        expect(setCookie).toHaveBeenCalled()
      })

      it('deve propagar erro quando db.user.findUnique falha', async () => {
        // Arrange
        vi.mocked(db.user.findUnique).mockRejectedValue(new Error('Database error'))

        // Act & Assert
        await expect(authenticateUser(validCredentials)).rejects.toThrow('Database error')
        expect(db.user.findUnique).toHaveBeenCalledWith({
          where: { email: validCredentials.email },
        })
        expect(verifyCrypt).not.toHaveBeenCalled()
        expect(signJwt).not.toHaveBeenCalled()
        expect(setCookie).not.toHaveBeenCalled()
      })
    })
  })

  describe('logoutUser', () => {
    describe('quando token existe', () => {
      it('deve fazer logout com sucesso quando token está presente', async () => {
        // Arrange
        vi.mocked(getCookie).mockResolvedValue('valid-token')
        vi.mocked(deleteCookie).mockResolvedValue()

        // Act
        const result = await logoutUser()

        // Assert
        expect(result).toEqual({ success: true })
        expect(getCookie).toHaveBeenCalledWith({
          name: appConfig.auth.tokenCookieName,
        })
        expect(deleteCookie).toHaveBeenCalledWith({
          name: appConfig.auth.tokenCookieName,
        })
      })
    })

    describe('quando token não existe', () => {
      it('deve retornar erro de não autorizado quando token está ausente', async () => {
        // Arrange
        vi.mocked(getCookie).mockResolvedValue(undefined)

        // Act
        const result = await logoutUser()

        // Assert
        expect(result).toEqual({ success: false, error: 'unauthorized' })
        expect(getCookie).toHaveBeenCalledWith({
          name: appConfig.auth.tokenCookieName,
        })
        expect(deleteCookie).not.toHaveBeenCalled()
      })

      it('deve retornar erro de não autorizado quando token está vazio', async () => {
        // Arrange
        vi.mocked(getCookie).mockResolvedValue('')

        // Act
        const result = await logoutUser()

        // Assert
        expect(result).toEqual({ success: false, error: 'unauthorized' })
        expect(getCookie).toHaveBeenCalledWith({
          name: appConfig.auth.tokenCookieName,
        })
        expect(deleteCookie).not.toHaveBeenCalled()
      })
    })

    describe('quando ocorrem erros durante o processo', () => {
      it('deve propagar erro quando getCookie falha', async () => {
        // Arrange
        vi.mocked(getCookie).mockRejectedValue(new Error('Cookie error'))

        // Act & Assert
        await expect(logoutUser()).rejects.toThrow('Cookie error')
        expect(getCookie).toHaveBeenCalledWith({
          name: appConfig.auth.tokenCookieName,
        })
        expect(deleteCookie).not.toHaveBeenCalled()
      })

      it('deve propagar erro quando deleteCookie falha', async () => {
        // Arrange
        vi.mocked(getCookie).mockResolvedValue('valid-token')
        vi.mocked(deleteCookie).mockRejectedValue(new Error('Delete cookie error'))

        // Act & Assert
        await expect(logoutUser()).rejects.toThrow('Delete cookie error')
        expect(getCookie).toHaveBeenCalledWith({
          name: appConfig.auth.tokenCookieName,
        })
        expect(deleteCookie).toHaveBeenCalledWith({
          name: appConfig.auth.tokenCookieName,
        })
      })
    })
  })

  describe('verifyUserToken', () => {
    const mockJwtPayload: JwtPayload = {
      userId: '1',
      iat: Date.now() / 1000,
      exp: Date.now() / 1000 + 3600,
    }

    const mockUser: MockUser = {
      id: '1',
      email: 'teste@exemplo.com',
      password: 'hashedPassword',
      fullName: 'João Silva',
      displayName: 'João',
      phone: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    describe('quando token é válido', () => {
      it('deve verificar token com sucesso quando tudo está válido', async () => {
        // Arrange
        vi.mocked(getCookie).mockResolvedValue('valid-token')
        vi.mocked(verifyJwt).mockReturnValue(mockJwtPayload)
        vi.mocked(db.user.findUnique).mockResolvedValue(mockUser)

        // Act
        const result = await verifyUserToken()

        // Assert
        expect(result).toEqual({ success: true })
        expect(getCookie).toHaveBeenCalledWith({
          name: appConfig.auth.tokenCookieName,
        })
        expect(verifyJwt).toHaveBeenCalledWith('valid-token')
        expect(db.user.findUnique).toHaveBeenCalledWith({
          where: { id: mockJwtPayload.userId },
        })
      })
    })

    describe('quando token não existe', () => {
      it('deve retornar erro de não autorizado quando token está ausente', async () => {
        // Arrange
        vi.mocked(getCookie).mockResolvedValue(undefined)

        // Act
        const result = await verifyUserToken()

        // Assert
        expect(result).toEqual({ success: false, error: 'unauthorized' })
        expect(getCookie).toHaveBeenCalledWith({
          name: appConfig.auth.tokenCookieName,
        })
        expect(verifyJwt).not.toHaveBeenCalled()
        expect(db.user.findUnique).not.toHaveBeenCalled()
      })

      it('deve retornar erro de não autorizado quando token está vazio', async () => {
        // Arrange
        vi.mocked(getCookie).mockResolvedValue('')

        // Act
        const result = await verifyUserToken()

        // Assert
        expect(result).toEqual({ success: false, error: 'unauthorized' })
        expect(getCookie).toHaveBeenCalledWith({
          name: appConfig.auth.tokenCookieName,
        })
        expect(verifyJwt).not.toHaveBeenCalled()
        expect(db.user.findUnique).not.toHaveBeenCalled()
      })
    })

    describe('quando token é inválido', () => {
      it('deve retornar erro de não autorizado quando token é malformado', async () => {
        // Arrange
        vi.mocked(getCookie).mockResolvedValue('invalid-token')
        vi.mocked(verifyJwt).mockReturnValue(null)

        // Act
        const result = await verifyUserToken()

        // Assert
        expect(result).toEqual({ success: false, error: 'unauthorized' })
        expect(getCookie).toHaveBeenCalledWith({
          name: appConfig.auth.tokenCookieName,
        })
        expect(verifyJwt).toHaveBeenCalledWith('invalid-token')
        expect(db.user.findUnique).not.toHaveBeenCalled()
      })

      it('deve retornar erro de não autorizado quando token está expirado', async () => {
        // Arrange
        const expiredPayload = {
          ...mockJwtPayload,
          exp: Date.now() / 1000 - 3600, // expirado há 1 hora
        }
        vi.mocked(getCookie).mockResolvedValue('expired-token')
        vi.mocked(verifyJwt).mockReturnValue(expiredPayload)
        vi.mocked(db.user.findUnique).mockResolvedValue(null)

        // Act
        const result = await verifyUserToken()

        // Assert
        expect(result).toEqual({ success: false, error: 'unauthorized' })
        expect(getCookie).toHaveBeenCalledWith({
          name: appConfig.auth.tokenCookieName,
        })
        expect(verifyJwt).toHaveBeenCalledWith('expired-token')
        expect(db.user.findUnique).toHaveBeenCalledWith({
          where: { id: mockJwtPayload.userId },
        })
      })
    })

    describe('quando usuário não existe no banco', () => {
      it('deve retornar erro de não autorizado quando usuário foi removido', async () => {
        // Arrange
        vi.mocked(getCookie).mockResolvedValue('valid-token')
        vi.mocked(verifyJwt).mockReturnValue(mockJwtPayload)
        vi.mocked(db.user.findUnique).mockResolvedValue(null)

        // Act
        const result = await verifyUserToken()

        // Assert
        expect(result).toEqual({ success: false, error: 'unauthorized' })
        expect(getCookie).toHaveBeenCalledWith({
          name: appConfig.auth.tokenCookieName,
        })
        expect(verifyJwt).toHaveBeenCalledWith('valid-token')
        expect(db.user.findUnique).toHaveBeenCalledWith({
          where: { id: mockJwtPayload.userId },
        })
      })
    })

    describe('quando ocorrem erros durante o processo', () => {
      it('deve propagar erro quando getCookie falha', async () => {
        // Arrange
        vi.mocked(getCookie).mockRejectedValue(new Error('Cookie error'))

        // Act & Assert
        await expect(verifyUserToken()).rejects.toThrow('Cookie error')
        expect(getCookie).toHaveBeenCalledWith({
          name: appConfig.auth.tokenCookieName,
        })
        expect(verifyJwt).not.toHaveBeenCalled()
        expect(db.user.findUnique).not.toHaveBeenCalled()
      })

      it('deve propagar erro quando db.user.findUnique falha', async () => {
        // Arrange
        vi.mocked(getCookie).mockResolvedValue('valid-token')
        vi.mocked(verifyJwt).mockReturnValue(mockJwtPayload)
        vi.mocked(db.user.findUnique).mockRejectedValue(new Error('Database error'))

        // Act & Assert
        await expect(verifyUserToken()).rejects.toThrow('Database error')
        expect(getCookie).toHaveBeenCalledWith({
          name: appConfig.auth.tokenCookieName,
        })
        expect(verifyJwt).toHaveBeenCalledWith('valid-token')
        expect(db.user.findUnique).toHaveBeenCalledWith({
          where: { id: mockJwtPayload.userId },
        })
      })
    })
  })
})
