import { beforeEach, describe, expect, it, vi } from 'vitest'

import { deleteCookie, getCookie, setCookie } from './cookie.helper'

// Mock da store de cookies
const mockCookieStore = {
  set: vi.fn(),
  delete: vi.fn(),
  get: vi.fn(),
}

// Mock da função cookies do Next.js
vi.mock('next/headers', () => ({
  cookies: () => mockCookieStore,
}))

describe('Cookie Helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('setCookie', () => {
    describe('quando receber parâmetros válidos', () => {
      it('deve definir o cookie quando receber nome, valor e opções completas', async () => {
        // Arrange
        const cookieParams = {
          name: 'authToken',
          value: 'jwt-token-123',
          options: {
            maxAge: 3600,
            httpOnly: true,
            path: '/',
            secure: true,
          },
        }

        // Act
        await setCookie(cookieParams)

        // Assert
        expect(mockCookieStore.set).toHaveBeenCalledTimes(1)
        expect(mockCookieStore.set).toHaveBeenCalledWith(cookieParams.name, cookieParams.value, cookieParams.options)
      })

      it('deve definir o cookie quando receber apenas nome e valor sem opções', async () => {
        // Arrange
        const cookieParams = {
          name: 'userPreference',
          value: 'dark-mode',
        }

        // Act
        await setCookie(cookieParams)

        // Assert
        expect(mockCookieStore.set).toHaveBeenCalledTimes(1)
        expect(mockCookieStore.set).toHaveBeenCalledWith(cookieParams.name, cookieParams.value, undefined)
      })

      it('deve definir o cookie quando receber nome e valor com opções parciais', async () => {
        // Arrange
        const cookieParams = {
          name: 'sessionId',
          value: 'session-456',
          options: {
            maxAge: 7200,
            path: '/dashboard',
          },
        }

        // Act
        await setCookie(cookieParams)

        // Assert
        expect(mockCookieStore.set).toHaveBeenCalledTimes(1)
        expect(mockCookieStore.set).toHaveBeenCalledWith(cookieParams.name, cookieParams.value, cookieParams.options)
      })
    })

    describe('quando receber entrada inválida', () => {
      it('deve não definir o cookie quando receber valor vazio', async () => {
        // Arrange
        const cookieParams = {
          name: 'emptyCookie',
          value: '',
        }

        // Act
        await setCookie(cookieParams)

        // Assert
        expect(mockCookieStore.set).not.toHaveBeenCalled()
      })

      it('deve não definir o cookie quando receber valor undefined', async () => {
        // Arrange
        const cookieParams = {
          name: 'undefinedCookie',
          value: undefined,
        }

        // Act
        await setCookie(cookieParams)

        // Assert
        expect(mockCookieStore.set).not.toHaveBeenCalled()
      })

      it('deve não definir o cookie quando receber valor null', async () => {
        // Arrange
        const cookieParams = {
          name: 'nullCookie',
          value: null as unknown as string | undefined,
        }

        // Act
        await setCookie(cookieParams)

        // Assert
        expect(mockCookieStore.set).not.toHaveBeenCalled()
      })
    })
  })

  describe('deleteCookie', () => {
    describe('quando receber nome válido', () => {
      it('deve excluir o cookie quando receber nome de cookie existente', async () => {
        // Arrange
        const cookieParams = { name: 'authToken' }

        // Act
        await deleteCookie(cookieParams)

        // Assert
        expect(mockCookieStore.delete).toHaveBeenCalledTimes(1)
        expect(mockCookieStore.delete).toHaveBeenCalledWith(cookieParams.name)
      })

      it('deve excluir o cookie quando receber nome de cookie inexistente', async () => {
        // Arrange
        const cookieParams = { name: 'nonExistentCookie' }

        // Act
        await deleteCookie(cookieParams)

        // Assert
        expect(mockCookieStore.delete).toHaveBeenCalledTimes(1)
        expect(mockCookieStore.delete).toHaveBeenCalledWith(cookieParams.name)
      })
    })
  })

  describe('getCookie', () => {
    describe('quando o cookie existe', () => {
      it('deve retornar o valor do cookie quando receber nome de cookie existente', async () => {
        // Arrange
        const cookieParams = { name: 'authToken' }
        const expectedValue = 'jwt-token-123'
        mockCookieStore.get.mockReturnValue({ value: expectedValue } as never)

        // Act
        const result = await getCookie(cookieParams)

        // Assert
        expect(result).toBe(expectedValue)
        expect(mockCookieStore.get).toHaveBeenCalledTimes(1)
        expect(mockCookieStore.get).toHaveBeenCalledWith(cookieParams.name)
      })

      it('deve retornar o valor do cookie quando receber nome de cookie com valor vazio', async () => {
        // Arrange
        const cookieParams = { name: 'emptyValueCookie' }
        const expectedValue = ''
        mockCookieStore.get.mockReturnValue({ value: expectedValue } as never)

        // Act
        const result = await getCookie(cookieParams)

        // Assert
        expect(result).toBe(expectedValue)
        expect(mockCookieStore.get).toHaveBeenCalledTimes(1)
        expect(mockCookieStore.get).toHaveBeenCalledWith(cookieParams.name)
      })
    })

    describe('quando o cookie não existe', () => {
      it('deve retornar undefined quando receber nome de cookie inexistente', async () => {
        // Arrange
        const cookieParams = { name: 'nonExistentCookie' }
        mockCookieStore.get.mockReturnValue(undefined)

        // Act
        const result = await getCookie(cookieParams)

        // Assert
        expect(result).toBeUndefined()
        expect(mockCookieStore.get).toHaveBeenCalledTimes(1)
        expect(mockCookieStore.get).toHaveBeenCalledWith(cookieParams.name)
      })

      it('deve retornar undefined quando receber nome de cookie que retorna null', async () => {
        // Arrange
        const cookieParams = { name: 'nullCookie' }
        mockCookieStore.get.mockReturnValue(null as never)

        // Act
        const result = await getCookie(cookieParams)

        // Assert
        expect(result).toBeUndefined()
        expect(mockCookieStore.get).toHaveBeenCalledTimes(1)
        expect(mockCookieStore.get).toHaveBeenCalledWith(cookieParams.name)
      })

      it('deve retornar undefined quando receber nome de cookie que retorna objeto sem value', async () => {
        // Arrange
        const cookieParams = { name: 'cookieWithoutValue' }
        mockCookieStore.get.mockReturnValue({} as never)

        // Act
        const result = await getCookie(cookieParams)

        // Assert
        expect(result).toBeUndefined()
        expect(mockCookieStore.get).toHaveBeenCalledTimes(1)
        expect(mockCookieStore.get).toHaveBeenCalledWith(cookieParams.name)
      })
    })
  })
})
