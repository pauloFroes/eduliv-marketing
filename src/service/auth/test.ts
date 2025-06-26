import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { cookieDelete, cookieGet, cookieSet } from '@/helpers/cookie'
import { jwtSign, jwtVerify } from '@/helpers/jwt'
import { pwdVerify } from '@/helpers/pwd'
import { config } from '@/lib/config'
import { db } from '@/lib/db'
import { ErrorType, ResponsePromise } from '@/types'

import { User } from '../../../prisma/generated'

import { serviceAuthLogin, serviceAuthLogout, serviceAuthVerifyUserIdToken } from './service'
import { AuthLogin } from './types'

// Mocks das dependências
vi.mock('@/lib/db', () => ({
  db: {
    user: {
      findUnique: vi.fn(),
    },
  },
}))

vi.mock('@/helpers/pwd', () => ({
  pwdVerify: vi.fn(),
}))

vi.mock('@/helpers/cookie', () => ({
  cookieGet: vi.fn(),
  cookieSet: vi.fn(),
  cookieDelete: vi.fn(),
}))

vi.mock('@/helpers/jwt', () => ({
  jwtSign: vi.fn(),
  jwtVerify: vi.fn(),
}))

// Type guard para verificar se é um erro
const isError = (result: ResponsePromise): result is { success: false; error: ErrorType } => {
  return !result.success
}

describe('Service Auth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('serviceAuthLogin', () => {
    const validLoginData: AuthLogin = {
      email: 'teste@exemplo.com',
      password: 'senha123456',
    }

    it('deve fazer login com sucesso', async () => {
      // Arrange
      const mockUser = {
        id: '1',
        email: validLoginData.email,
        password: 'hashedPassword',
        fullName: 'João Silva',
        displayName: 'João',
        phone: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const mockToken = 'jwt-token-generated'

      vi.mocked(db.user.findUnique).mockResolvedValue(mockUser as User)
      vi.mocked(pwdVerify).mockResolvedValue(true)
      vi.mocked(jwtSign).mockReturnValue(mockToken)
      vi.mocked(cookieSet).mockResolvedValue(undefined)

      // Act
      const result = await serviceAuthLogin(validLoginData)

      // Assert
      expect(result.success).toBe(true)
      expect(db.user.findUnique).toHaveBeenCalledWith({
        where: { email: validLoginData.email },
      })
      expect(pwdVerify).toHaveBeenCalledWith(validLoginData.password, mockUser.password)
      expect(jwtSign).toHaveBeenCalledWith({ userId: mockUser.id })
      expect(cookieSet).toHaveBeenCalledWith({
        name: config.auth.tokenCookieName,
        value: mockToken,
        options: { maxAge: 60 * 60 * 24 * 30, httpOnly: true, path: '/', secure: false },
      })
    })

    it('deve retornar false quando os dados são inválidos - email inválido', async () => {
      // Arrange
      const invalidLoginData = {
        email: 'email-invalido',
        password: 'senha123456',
      }

      // Act
      const result = await serviceAuthLogin(invalidLoginData)

      // Assert
      expect(result.success).toBe(false)
      if (isError(result)) {
        expect(result.error).toBe('validationError')
      }
      expect(db.user.findUnique).not.toHaveBeenCalled()
      expect(pwdVerify).not.toHaveBeenCalled()
      expect(jwtSign).not.toHaveBeenCalled()
      expect(cookieSet).not.toHaveBeenCalled()
    })

    it('deve retornar false quando os dados são inválidos - senha muito curta', async () => {
      // Arrange
      const invalidLoginData = {
        email: 'teste@exemplo.com',
        password: '123',
      }

      // Act
      const result = await serviceAuthLogin(invalidLoginData)

      // Assert
      expect(result.success).toBe(false)
      if (isError(result)) {
        expect(result.error).toBe('validationError')
      }
      expect(db.user.findUnique).not.toHaveBeenCalled()
    })

    it('deve retornar false quando o usuário não existe', async () => {
      // Arrange
      vi.mocked(db.user.findUnique).mockResolvedValue(null)

      // Act
      const result = await serviceAuthLogin(validLoginData)

      // Assert
      expect(result.success).toBe(false)
      if (isError(result)) {
        expect(result.error).toBe('invalidCredentials')
      }
      expect(db.user.findUnique).toHaveBeenCalledWith({
        where: { email: validLoginData.email },
      })
      expect(pwdVerify).not.toHaveBeenCalled()
      expect(jwtSign).not.toHaveBeenCalled()
      expect(cookieSet).not.toHaveBeenCalled()
    })

    it('deve retornar false quando a senha está incorreta', async () => {
      // Arrange
      const mockUser = {
        id: '1',
        email: validLoginData.email,
        password: 'hashedPassword',
        fullName: 'João Silva',
        displayName: 'João',
        phone: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      vi.mocked(db.user.findUnique).mockResolvedValue(mockUser as User)
      vi.mocked(pwdVerify).mockResolvedValue(false)

      // Act
      const result = await serviceAuthLogin(validLoginData)

      // Assert
      expect(result.success).toBe(false)
      if (isError(result)) {
        expect(result.error).toBe('invalidCredentials')
      }
      expect(db.user.findUnique).toHaveBeenCalledWith({
        where: { email: validLoginData.email },
      })
      expect(pwdVerify).toHaveBeenCalledWith(validLoginData.password, mockUser.password)
      expect(jwtSign).not.toHaveBeenCalled()
      expect(cookieSet).not.toHaveBeenCalled()
    })

    it('deve processar transformações de dados corretamente', async () => {
      // Arrange
      const loginDataWithTransforms: AuthLogin = {
        email: '  TESTE@EXEMPLO.COM  ',
        password: '  senha123456  ',
      }

      const mockUser = {
        id: '1',
        email: 'teste@exemplo.com',
        password: 'hashedPassword',
        fullName: 'João Silva',
        displayName: 'João',
        phone: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const mockToken = 'jwt-token-generated'

      vi.mocked(db.user.findUnique).mockResolvedValue(mockUser as User)
      vi.mocked(pwdVerify).mockResolvedValue(true)
      vi.mocked(jwtSign).mockReturnValue(mockToken)
      vi.mocked(cookieSet).mockResolvedValue(undefined)

      // Act
      const result = await serviceAuthLogin(loginDataWithTransforms)

      // Assert
      expect(result.success).toBe(true)
      expect(db.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'teste@exemplo.com' },
      })
      expect(pwdVerify).toHaveBeenCalledWith('senha123456', mockUser.password)
    })
  })

  describe('serviceAuthLogout', () => {
    it('deve fazer logout com sucesso', async () => {
      // Arrange
      const mockToken = 'existing-jwt-token'

      vi.mocked(cookieGet).mockResolvedValue(mockToken)
      vi.mocked(cookieDelete).mockResolvedValue(undefined)

      // Act
      const result = await serviceAuthLogout()

      // Assert
      expect(result.success).toBe(true)
      expect(cookieGet).toHaveBeenCalledWith({ name: config.auth.tokenCookieName })
      expect(cookieDelete).toHaveBeenCalledWith({ name: config.auth.tokenCookieName })
    })

    it('deve retornar false quando não há token', async () => {
      // Arrange
      vi.mocked(cookieGet).mockResolvedValue(undefined)

      // Act
      const result = await serviceAuthLogout()

      // Assert
      expect(result.success).toBe(false)
      if (isError(result)) {
        expect(result.error).toBe('unauthorized')
      }
      expect(cookieGet).toHaveBeenCalledWith({ name: config.auth.tokenCookieName })
      expect(cookieDelete).not.toHaveBeenCalled()
    })

    it('deve retornar false quando há token vazio', async () => {
      // Arrange
      vi.mocked(cookieGet).mockResolvedValue('')

      // Act
      const result = await serviceAuthLogout()

      // Assert
      expect(result.success).toBe(false)
      if (isError(result)) {
        expect(result.error).toBe('unauthorized')
      }
      expect(cookieGet).toHaveBeenCalledWith({ name: config.auth.tokenCookieName })
      expect(cookieDelete).not.toHaveBeenCalled()
    })
  })

  describe('serviceAuthVerifyUserIdToken', () => {
    it('deve verificar token com sucesso', async () => {
      // Arrange
      const mockToken = 'valid-jwt-token'
      const mockDecoded = { userId: '1' }
      const mockUser = {
        id: '1',
        email: 'teste@exemplo.com',
        fullName: 'João Silva',
        displayName: 'João',
        password: 'hashedPassword',
        phone: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      vi.mocked(cookieGet).mockResolvedValue(mockToken)
      vi.mocked(jwtVerify).mockReturnValue(mockDecoded)
      vi.mocked(db.user.findUnique).mockResolvedValue(mockUser as User)

      // Act
      const result = await serviceAuthVerifyUserIdToken()

      // Assert
      expect(result.success).toBe(true)
      expect(cookieGet).toHaveBeenCalledWith({ name: config.auth.tokenCookieName })
      expect(jwtVerify).toHaveBeenCalledWith(mockToken)
      expect(db.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockDecoded.userId },
      })
    })

    it('deve retornar false quando não há token', async () => {
      // Arrange
      vi.mocked(cookieGet).mockResolvedValue(undefined)

      // Act
      const result = await serviceAuthVerifyUserIdToken()

      // Assert
      expect(result.success).toBe(false)
      if (isError(result)) {
        expect(result.error).toBe('unauthorized')
      }
      expect(cookieGet).toHaveBeenCalledWith({ name: config.auth.tokenCookieName })
      expect(jwtVerify).not.toHaveBeenCalled()
      expect(db.user.findUnique).not.toHaveBeenCalled()
    })

    it('deve retornar false quando há token vazio', async () => {
      // Arrange
      vi.mocked(cookieGet).mockResolvedValue('')

      // Act
      const result = await serviceAuthVerifyUserIdToken()

      // Assert
      expect(result.success).toBe(false)
      if (isError(result)) {
        expect(result.error).toBe('unauthorized')
      }
      expect(cookieGet).toHaveBeenCalledWith({ name: config.auth.tokenCookieName })
      expect(jwtVerify).not.toHaveBeenCalled()
      expect(db.user.findUnique).not.toHaveBeenCalled()
    })

    it('deve retornar false quando o token é inválido', async () => {
      // Arrange
      const mockToken = 'invalid-jwt-token'

      vi.mocked(cookieGet).mockResolvedValue(mockToken)
      vi.mocked(jwtVerify).mockReturnValue(null)

      // Act
      const result = await serviceAuthVerifyUserIdToken()

      // Assert
      expect(result.success).toBe(false)
      if (isError(result)) {
        expect(result.error).toBe('unauthorized')
      }
      expect(cookieGet).toHaveBeenCalledWith({ name: config.auth.tokenCookieName })
      expect(jwtVerify).toHaveBeenCalledWith(mockToken)
      expect(db.user.findUnique).not.toHaveBeenCalled()
    })

    it('deve retornar false quando o usuário não existe', async () => {
      // Arrange
      const mockToken = 'valid-jwt-token'
      const mockDecoded = { userId: '999' }

      vi.mocked(cookieGet).mockResolvedValue(mockToken)
      vi.mocked(jwtVerify).mockReturnValue(mockDecoded)
      vi.mocked(db.user.findUnique).mockResolvedValue(null)

      // Act
      const result = await serviceAuthVerifyUserIdToken()

      // Assert
      expect(result.success).toBe(false)
      if (isError(result)) {
        expect(result.error).toBe('unauthorized')
      }
      expect(cookieGet).toHaveBeenCalledWith({ name: config.auth.tokenCookieName })
      expect(jwtVerify).toHaveBeenCalledWith(mockToken)
      expect(db.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockDecoded.userId },
      })
    })
  })
})
