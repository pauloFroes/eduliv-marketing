import { describe, it, expect, vi, beforeEach } from 'vitest'
import jwt from 'jsonwebtoken'
import { jwtSign, jwtVerify } from './jwt'

// Mock do jsonwebtoken
vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn(),
    verify: vi.fn(),
  },
}))

describe('JWT Helper Functions', () => {
  const mockJwt = vi.mocked(jwt)
  const originalEnv = process.env

  beforeEach(() => {
    vi.clearAllMocks()
    process.env = {
      ...originalEnv,
      JWT_SECRET: 'test-secret-key',
      JWT_EXPIRES_IN: '3600',
    }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('jwtSign', () => {
    it('should sign JWT with correct payload and options', () => {
      const payload = { userId: 'user123' }
      const expectedToken = 'signed.jwt.token'
      
      mockJwt.sign.mockReturnValue(expectedToken)

      const result = jwtSign(payload)

      expect(mockJwt.sign).toHaveBeenCalledWith(
        payload,
        'test-secret-key',
        { expiresIn: 3600 }
      )
      expect(result).toBe(expectedToken)
    })

    it('should handle different user IDs', () => {
      const payload = { userId: 'different-user-456' }
      const expectedToken = 'another.jwt.token'
      
      mockJwt.sign.mockReturnValue(expectedToken)

      const result = jwtSign(payload)

      expect(mockJwt.sign).toHaveBeenCalledWith(
        payload,
        'test-secret-key',
        { expiresIn: 3600 }
      )
      expect(result).toBe(expectedToken)
    })

    it('should handle empty user ID', () => {
      const payload = { userId: '' }
      const expectedToken = 'empty.user.token'
      
      mockJwt.sign.mockReturnValue(expectedToken)

      const result = jwtSign(payload)

      expect(mockJwt.sign).toHaveBeenCalledWith(
        payload,
        'test-secret-key',
        { expiresIn: 3600 }
      )
      expect(result).toBe(expectedToken)
    })

    it('should handle special characters in user ID', () => {
      const payload = { userId: 'user@123.com' }
      const expectedToken = 'special.char.token'
      
      mockJwt.sign.mockReturnValue(expectedToken)

      const result = jwtSign(payload)

      expect(mockJwt.sign).toHaveBeenCalledWith(
        payload,
        'test-secret-key',
        { expiresIn: 3600 }
      )
      expect(result).toBe(expectedToken)
    })
  })

  describe('jwtVerify', () => {
    it('should verify valid JWT and return payload', () => {
      const token = 'valid.jwt.token'
      const expectedPayload = { userId: 'user123' }
      
      mockJwt.verify.mockReturnValue(expectedPayload as any)

      const result = jwtVerify(token)

      expect(mockJwt.verify).toHaveBeenCalledWith(token, 'test-secret-key')
      expect(result).toEqual(expectedPayload)
    })

    it('should return null for invalid JWT', () => {
      const token = 'invalid.jwt.token'
      
      mockJwt.verify.mockImplementation(() => {
        throw new Error('Invalid token')
      })

      const result = jwtVerify(token)

      expect(mockJwt.verify).toHaveBeenCalledWith(token, 'test-secret-key')
      expect(result).toBeNull()
    })

    it('should return null for expired JWT', () => {
      const token = 'expired.jwt.token'
      
      mockJwt.verify.mockImplementation(() => {
        throw new Error('Token expired')
      })

      const result = jwtVerify(token)

      expect(result).toBeNull()
    })

    it('should return null for malformed JWT', () => {
      const token = 'malformed-token'
      
      mockJwt.verify.mockImplementation(() => {
        throw new Error('Malformed token')
      })

      const result = jwtVerify(token)

      expect(result).toBeNull()
    })

    it('should handle empty token string', () => {
      const token = ''
      
      mockJwt.verify.mockImplementation(() => {
        throw new Error('Empty token')
      })

      const result = jwtVerify(token)

      expect(result).toBeNull()
    })

    it('should return payload with different user IDs', () => {
      const token = 'different.user.token'
      const expectedPayload = { userId: 'different-user-456' }
      
      mockJwt.verify.mockReturnValue(expectedPayload as any)

      const result = jwtVerify(token)

      expect(result).toEqual(expectedPayload)
    })

    it('should handle JWT verification throwing non-Error objects', () => {
      const token = 'weird.error.token'
      
      mockJwt.verify.mockImplementation(() => {
        throw 'String error'
      })

      const result = jwtVerify(token)

      expect(result).toBeNull()
    })
  })


})