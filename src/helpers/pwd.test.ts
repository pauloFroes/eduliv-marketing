import { describe, it, expect, vi, beforeEach } from 'vitest'
import bcrypt from 'bcrypt'
import { pwdCrypt, pwdVerify } from './pwd'

// Mock do bcrypt
vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}))

describe('Password Helper Functions', () => {
  const mockBcrypt = vi.mocked(bcrypt)
  const originalEnv = process.env

  beforeEach(() => {
    vi.clearAllMocks()
    // BCRYPT_COST is already set to '1' in test setup
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('pwdCrypt', () => {
    it('should hash password with correct cost', async () => {
      const password = 'mySecurePassword123'
      const expectedHash = '$2b$1$hashedPasswordString'
      
      mockBcrypt.hash.mockResolvedValue(expectedHash)

      const result = await pwdCrypt(password)

      expect(mockBcrypt.hash).toHaveBeenCalledWith(password, 1)
      expect(result).toBe(expectedHash)
    })

    it('should handle empty password', async () => {
      const password = ''
      const expectedHash = '$2b$1$emptyPasswordHash'
      
      mockBcrypt.hash.mockResolvedValue(expectedHash)

      const result = await pwdCrypt(password)

      expect(mockBcrypt.hash).toHaveBeenCalledWith(password, 1)
      expect(result).toBe(expectedHash)
    })

    it('should handle password with special characters', async () => {
      const password = 'P@ssw0rd!@#$%^&*()'
      const expectedHash = '$2b$1$specialCharPasswordHash'
      
      mockBcrypt.hash.mockResolvedValue(expectedHash)

      const result = await pwdCrypt(password)

      expect(mockBcrypt.hash).toHaveBeenCalledWith(password, 1)
      expect(result).toBe(expectedHash)
    })

    it('should handle very long password', async () => {
      const password = 'a'.repeat(1000)
      const expectedHash = '$2b$1$longPasswordHash'
      
      mockBcrypt.hash.mockResolvedValue(expectedHash)

      const result = await pwdCrypt(password)

      expect(mockBcrypt.hash).toHaveBeenCalledWith(password, 1)
      expect(result).toBe(expectedHash)
    })

    it('should handle password with unicode characters', async () => {
      const password = 'senha123áéíóú中文🔒'
      const expectedHash = '$2b$1$unicodePasswordHash'
      
      mockBcrypt.hash.mockResolvedValue(expectedHash)

      const result = await pwdCrypt(password)

      expect(mockBcrypt.hash).toHaveBeenCalledWith(password, 1)
      expect(result).toBe(expectedHash)
    })

    it('should use BCRYPT_COST from environment', async () => {
      const password = 'testPassword'
      const expectedHash = '$2b$1$testCostHash'
      
      mockBcrypt.hash.mockResolvedValue(expectedHash)

      const result = await pwdCrypt(password)

      expect(mockBcrypt.hash).toHaveBeenCalledWith(password, 1)
      expect(result).toBe(expectedHash)
    })
  })

  describe('pwdVerify', () => {
    it('should return true for matching password and hash', async () => {
      const password = 'mySecurePassword123'
      const hash = '$2b$10$hashedPasswordString'
      
      mockBcrypt.compare.mockResolvedValue(true)

      const result = await pwdVerify(password, hash)

      expect(mockBcrypt.compare).toHaveBeenCalledWith(password, hash)
      expect(result).toBe(true)
    })

    it('should return false for non-matching password and hash', async () => {
      const password = 'wrongPassword'
      const hash = '$2b$10$hashedPasswordString'
      
      mockBcrypt.compare.mockResolvedValue(false)

      const result = await pwdVerify(password, hash)

      expect(mockBcrypt.compare).toHaveBeenCalledWith(password, hash)
      expect(result).toBe(false)
    })

    it('should handle empty password with valid hash', async () => {
      const password = ''
      const hash = '$2b$10$hashedEmptyPasswordString'
      
      mockBcrypt.compare.mockResolvedValue(true)

      const result = await pwdVerify(password, hash)

      expect(mockBcrypt.compare).toHaveBeenCalledWith(password, hash)
      expect(result).toBe(true)
    })

    it('should handle valid password with empty hash', async () => {
      const password = 'validPassword'
      const hash = ''
      
      mockBcrypt.compare.mockResolvedValue(false)

      const result = await pwdVerify(password, hash)

      expect(mockBcrypt.compare).toHaveBeenCalledWith(password, hash)
      expect(result).toBe(false)
    })

    it('should handle both empty password and hash', async () => {
      const password = ''
      const hash = ''
      
      mockBcrypt.compare.mockResolvedValue(false)

      const result = await pwdVerify(password, hash)

      expect(mockBcrypt.compare).toHaveBeenCalledWith(password, hash)
      expect(result).toBe(false)
    })

    it('should handle password with special characters', async () => {
      const password = 'P@ssw0rd!@#$%^&*()'
      const hash = '$2b$10$specialCharPasswordHash'
      
      mockBcrypt.compare.mockResolvedValue(true)

      const result = await pwdVerify(password, hash)

      expect(mockBcrypt.compare).toHaveBeenCalledWith(password, hash)
      expect(result).toBe(true)
    })

    it('should handle password with unicode characters', async () => {
      const password = 'senha123áéíóú中文🔒'
      const hash = '$2b$10$unicodePasswordHash'
      
      mockBcrypt.compare.mockResolvedValue(true)

      const result = await pwdVerify(password, hash)

      expect(mockBcrypt.compare).toHaveBeenCalledWith(password, hash)
      expect(result).toBe(true)
    })

    it('should handle malformed hash', async () => {
      const password = 'validPassword'
      const hash = 'invalidHashFormat'
      
      mockBcrypt.compare.mockResolvedValue(false)

      const result = await pwdVerify(password, hash)

      expect(mockBcrypt.compare).toHaveBeenCalledWith(password, hash)
      expect(result).toBe(false)
    })
  })


})