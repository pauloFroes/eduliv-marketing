import { describe, it, expect, vi, beforeEach } from 'vitest'
import { cookies } from 'next/headers'
import { cookieSet, cookieDelete, cookieGet } from './cookie'

// Mock do next/headers
vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

describe('Cookie Helper Functions', () => {
  const mockCookieStore = {
    set: vi.fn(),
    delete: vi.fn(),
    get: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(cookies).mockResolvedValue(mockCookieStore as any)
  })

  describe('cookieSet', () => {
    it('should set cookie with correct parameters in production', async () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'

      await cookieSet('test-cookie', 'test-value')

      expect(cookies).toHaveBeenCalledOnce()
      expect(mockCookieStore.set).toHaveBeenCalledWith('test-cookie', 'test-value', {
        secure: true,
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
        httpOnly: true,
      })

      process.env.NODE_ENV = originalEnv
    })

    it('should set cookie with secure false in development', async () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'

      await cookieSet('dev-cookie', 'dev-value')

      expect(cookies).toHaveBeenCalledOnce()
      expect(mockCookieStore.set).toHaveBeenCalledWith('dev-cookie', 'dev-value', {
        secure: false,
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
        httpOnly: true,
      })

      process.env.NODE_ENV = originalEnv
    })

    it('should handle empty string values', async () => {
      await cookieSet('empty-cookie', '')

      expect(mockCookieStore.set).toHaveBeenCalledWith('empty-cookie', '', expect.any(Object))
    })

    it('should handle special characters in cookie name and value', async () => {
      await cookieSet('special-cookie-name', 'special/value@123')

      expect(mockCookieStore.set).toHaveBeenCalledWith('special-cookie-name', 'special/value@123', expect.any(Object))
    })
  })

  describe('cookieDelete', () => {
    it('should delete cookie by name', async () => {
      await cookieDelete('test-cookie')

      expect(cookies).toHaveBeenCalledOnce()
      expect(mockCookieStore.delete).toHaveBeenCalledWith('test-cookie')
    })

    it('should handle deletion of non-existent cookie', async () => {
      await cookieDelete('non-existent-cookie')

      expect(mockCookieStore.delete).toHaveBeenCalledWith('non-existent-cookie')
    })

    it('should handle empty string cookie name', async () => {
      await cookieDelete('')

      expect(mockCookieStore.delete).toHaveBeenCalledWith('')
    })
  })

  describe('cookieGet', () => {
    it('should return cookie value when cookie exists', async () => {
      mockCookieStore.get.mockReturnValue({ value: 'test-value' })

      const result = await cookieGet('test-cookie')

      expect(cookies).toHaveBeenCalledOnce()
      expect(mockCookieStore.get).toHaveBeenCalledWith('test-cookie')
      expect(result).toBe('test-value')
    })

    it('should return undefined when cookie does not exist', async () => {
      mockCookieStore.get.mockReturnValue(undefined)

      const result = await cookieGet('non-existent-cookie')

      expect(mockCookieStore.get).toHaveBeenCalledWith('non-existent-cookie')
      expect(result).toBeUndefined()
    })

    it('should return undefined when cookie exists but has no value', async () => {
      mockCookieStore.get.mockReturnValue({})

      const result = await cookieGet('empty-cookie')

      expect(result).toBeUndefined()
    })

    it('should handle empty string cookie name', async () => {
      mockCookieStore.get.mockReturnValue(undefined)

      const result = await cookieGet('')

      expect(mockCookieStore.get).toHaveBeenCalledWith('')
      expect(result).toBeUndefined()
    })

    it('should return empty string value when cookie has empty string value', async () => {
      mockCookieStore.get.mockReturnValue({ value: '' })

      const result = await cookieGet('empty-value-cookie')

      expect(result).toBe('')
    })
  })
})