import jwt from 'jsonwebtoken'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { signJwt, verifyJwt } from './jwt.helper'

// Mock do módulo jsonwebtoken
vi.mock('jsonwebtoken')

// Mock da configuração da aplicação
vi.mock('@/config/app', () => ({
  appConfig: {
    auth: {
      jwtSecret: 'test-secret-key',
      jwtExpiresIn: 24,
    },
  },
}))

describe('JWT Helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('signJwt', () => {
    describe('quando receber payload válido', () => {
      it('deve gerar token JWT quando receber payload com userId e email', () => {
        // Arrange
        const mockPayload = { userId: '123', email: 'test@example.com' }
        const expectedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(jwt.sign as any).mockReturnValue(expectedToken)

        // Act
        const result = signJwt(mockPayload)

        // Assert
        expect(result).toBe(expectedToken)
        expect(jwt.sign).toHaveBeenCalledTimes(1)
        expect(jwt.sign).toHaveBeenCalledWith(mockPayload, 'test-secret-key', { expiresIn: '24h' })
      })

      it('deve gerar token JWT quando receber payload apenas com userId', () => {
        // Arrange
        const mockPayload = { userId: '456' }
        const expectedToken = 'token.123.456'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(jwt.sign as any).mockReturnValue(expectedToken)

        // Act
        const result = signJwt(mockPayload)

        // Assert
        expect(result).toBe(expectedToken)
        expect(jwt.sign).toHaveBeenCalledTimes(1)
        expect(jwt.sign).toHaveBeenCalledWith(mockPayload, 'test-secret-key', { expiresIn: '24h' })
      })

      it('deve gerar token JWT quando receber payload com múltiplas propriedades', () => {
        // Arrange
        const mockPayload = {
          userId: '789',
          email: 'user@example.com',
          role: 'admin',
          permissions: ['read', 'write'],
        }
        const expectedToken = 'complex.payload.token'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(jwt.sign as any).mockReturnValue(expectedToken)

        // Act
        const result = signJwt(mockPayload)

        // Assert
        expect(result).toBe(expectedToken)
        expect(jwt.sign).toHaveBeenCalledTimes(1)
        expect(jwt.sign).toHaveBeenCalledWith(mockPayload, 'test-secret-key', { expiresIn: '24h' })
      })
    })

    describe('quando receber entrada inválida', () => {
      it('deve gerar token JWT quando receber payload vazio', () => {
        // Arrange
        const mockPayload = {}
        const expectedToken = 'empty.payload.token'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(jwt.sign as any).mockReturnValue(expectedToken)

        // Act
        const result = signJwt(mockPayload)

        // Assert
        expect(result).toBe(expectedToken)
        expect(jwt.sign).toHaveBeenCalledTimes(1)
        expect(jwt.sign).toHaveBeenCalledWith(mockPayload, 'test-secret-key', { expiresIn: '24h' })
      })
    })

    describe('configuração do JWT', () => {
      it('deve usar a configuração correta de expiração quando gerar token', () => {
        // Arrange
        const mockPayload = { userId: '123' }
        const expectedToken = 'token.with.expiration'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(jwt.sign as any).mockReturnValue(expectedToken)

        // Act
        const result = signJwt(mockPayload)

        // Assert
        expect(result).toBe(expectedToken)
        expect(jwt.sign).toHaveBeenCalledWith(mockPayload, 'test-secret-key', { expiresIn: '24h' })
      })

      it('deve usar a chave secreta correta quando gerar token', () => {
        // Arrange
        const mockPayload = { userId: '123' }
        const expectedToken = 'token.with.secret'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(jwt.sign as any).mockReturnValue(expectedToken)

        // Act
        signJwt(mockPayload)

        // Assert
        expect(jwt.sign).toHaveBeenCalledWith(mockPayload, 'test-secret-key', { expiresIn: '24h' })
      })
    })
  })

  describe('verifyJwt', () => {
    describe('quando receber token válido', () => {
      it('deve retornar payload decodificado quando receber token válido', () => {
        // Arrange
        const mockToken = 'valid.token.here'
        const expectedPayload = {
          userId: '123',
          iat: 1234567890,
          exp: 1234567890 + 86400,
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(jwt.verify as any).mockReturnValue(expectedPayload)

        // Act
        const result = verifyJwt(mockToken)

        // Assert
        expect(result).toEqual(expectedPayload)
        expect(jwt.verify).toHaveBeenCalledTimes(1)
        expect(jwt.verify).toHaveBeenCalledWith(mockToken, 'test-secret-key')
      })

      it('deve retornar payload decodificado quando receber token com payload simples', () => {
        // Arrange
        const mockToken = 'simple.token.here'
        const expectedPayload = {
          userId: '456',
          iat: 1234567890,
          exp: 1234567890 + 86400,
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(jwt.verify as any).mockReturnValue(expectedPayload)

        // Act
        const result = verifyJwt(mockToken)

        // Assert
        expect(result).toEqual(expectedPayload)
        expect(jwt.verify).toHaveBeenCalledTimes(1)
        expect(jwt.verify).toHaveBeenCalledWith(mockToken, 'test-secret-key')
      })
    })

    describe('quando receber token inválido', () => {
      it('deve retornar null quando receber token inválido', () => {
        // Arrange
        const mockToken = 'invalid.token.here'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(jwt.verify as any).mockImplementation(() => {
          throw new Error('Invalid token')
        })

        // Act
        const result = verifyJwt(mockToken)

        // Assert
        expect(result).toBe(null)
        expect(jwt.verify).toHaveBeenCalledTimes(1)
        expect(jwt.verify).toHaveBeenCalledWith(mockToken, 'test-secret-key')
      })

      it('deve retornar null quando receber token expirado', () => {
        // Arrange
        const mockToken = 'expired.token.here'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(jwt.verify as any).mockImplementation(() => {
          throw new jwt.TokenExpiredError('Token expired', new Date())
        })

        // Act
        const result = verifyJwt(mockToken)

        // Assert
        expect(result).toBe(null)
        expect(jwt.verify).toHaveBeenCalledTimes(1)
        expect(jwt.verify).toHaveBeenCalledWith(mockToken, 'test-secret-key')
      })

      it('deve retornar null quando receber token malformado', () => {
        // Arrange
        const mockToken = 'malformed.token'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(jwt.verify as any).mockImplementation(() => {
          throw new jwt.JsonWebTokenError('Invalid token')
        })

        // Act
        const result = verifyJwt(mockToken)

        // Assert
        expect(result).toBe(null)
        expect(jwt.verify).toHaveBeenCalledTimes(1)
        expect(jwt.verify).toHaveBeenCalledWith(mockToken, 'test-secret-key')
      })

      it('deve retornar null quando receber token com assinatura inválida', () => {
        // Arrange
        const mockToken = 'wrong.signature.token'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(jwt.verify as any).mockImplementation(() => {
          throw new jwt.NotBeforeError('Token not active', new Date())
        })

        // Act
        const result = verifyJwt(mockToken)

        // Assert
        expect(result).toBe(null)
        expect(jwt.verify).toHaveBeenCalledTimes(1)
        expect(jwt.verify).toHaveBeenCalledWith(mockToken, 'test-secret-key')
      })
    })

    describe('quando receber entrada inválida', () => {
      it('deve retornar null quando receber string vazia', () => {
        // Arrange
        const mockToken = ''
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(jwt.verify as any).mockImplementation(() => {
          throw new Error('Empty token')
        })

        // Act
        const result = verifyJwt(mockToken)

        // Assert
        expect(result).toBe(null)
        expect(jwt.verify).toHaveBeenCalledTimes(1)
        expect(jwt.verify).toHaveBeenCalledWith(mockToken, 'test-secret-key')
      })

      it('deve retornar null quando receber apenas espaços', () => {
        // Arrange
        const mockToken = '   '
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(jwt.verify as any).mockImplementation(() => {
          throw new Error('Whitespace token')
        })

        // Act
        const result = verifyJwt(mockToken)

        // Assert
        expect(result).toBe(null)
        expect(jwt.verify).toHaveBeenCalledTimes(1)
        expect(jwt.verify).toHaveBeenCalledWith(mockToken, 'test-secret-key')
      })

      it('deve retornar null quando receber caracteres inválidos', () => {
        // Arrange
        const mockToken = 'invalid@#$%^&*()'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(jwt.verify as any).mockImplementation(() => {
          throw new Error('Invalid characters')
        })

        // Act
        const result = verifyJwt(mockToken)

        // Assert
        expect(result).toBe(null)
        expect(jwt.verify).toHaveBeenCalledTimes(1)
        expect(jwt.verify).toHaveBeenCalledWith(mockToken, 'test-secret-key')
      })

      it('deve retornar null quando receber token muito longo', () => {
        // Arrange
        const mockToken = 'a'.repeat(10000)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(jwt.verify as any).mockImplementation(() => {
          throw new Error('Token too long')
        })

        // Act
        const result = verifyJwt(mockToken)

        // Assert
        expect(result).toBe(null)
        expect(jwt.verify).toHaveBeenCalledTimes(1)
        expect(jwt.verify).toHaveBeenCalledWith(mockToken, 'test-secret-key')
      })

      it('deve retornar null quando receber token com formato incorreto', () => {
        // Arrange
        const mockToken = 'not.a.valid.jwt.format'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(jwt.verify as any).mockImplementation(() => {
          throw new Error('Invalid format')
        })

        // Act
        const result = verifyJwt(mockToken)

        // Assert
        expect(result).toBe(null)
        expect(jwt.verify).toHaveBeenCalledTimes(1)
        expect(jwt.verify).toHaveBeenCalledWith(mockToken, 'test-secret-key')
      })
    })

    describe('configuração do JWT', () => {
      it('deve usar a chave secreta correta quando verificar token', () => {
        // Arrange
        const mockToken = 'valid.token.here'
        const expectedPayload = {
          userId: '123',
          iat: 1234567890,
          exp: 1234567890 + 86400,
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(jwt.verify as any).mockReturnValue(expectedPayload)

        // Act
        verifyJwt(mockToken)

        // Assert
        expect(jwt.verify).toHaveBeenCalledWith(mockToken, 'test-secret-key')
      })
    })

    describe('integração entre signJwt e verifyJwt', () => {
      it('deve verificar token gerado pelo signJwt corretamente', () => {
        // Arrange
        const mockPayload = { userId: '123', email: 'test@example.com' }
        const generatedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        const expectedPayload = {
          userId: '123',
          email: 'test@example.com',
          iat: 1234567890,
          exp: 1234567890 + 86400,
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(jwt.sign as any).mockReturnValue(generatedToken)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(jwt.verify as any).mockReturnValue(expectedPayload)

        // Act
        const signedToken = signJwt(mockPayload)
        const verifiedPayload = verifyJwt(signedToken)

        // Assert
        expect(signedToken).toBe(generatedToken)
        expect(verifiedPayload).toEqual(expectedPayload)
        expect(jwt.sign).toHaveBeenCalledWith(mockPayload, 'test-secret-key', { expiresIn: '24h' })
        expect(jwt.verify).toHaveBeenCalledWith(generatedToken, 'test-secret-key')
      })
    })
  })
})
