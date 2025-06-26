import { describe, expect, it, vi, beforeEach } from 'vitest'
import { cookies } from 'next/headers'

import { cookieSet, cookieDelete, cookieGet } from './helper'
import { Cookie } from './types'

// Mock das funções do cookies
const mockSet = vi.fn()
const mockDelete = vi.fn()
const mockGet = vi.fn()

vi.mocked(cookies).mockResolvedValue({
  set: mockSet,
  delete: mockDelete,
  get: mockGet,
} as any)

describe('cookieSet', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve definir um cookie com nome e valor', async () => {
    const cookieData: Cookie = {
      name: 'testCookie',
      value: 'testValue'
    }

    await cookieSet(cookieData)

    expect(mockSet).toHaveBeenCalledWith('testCookie', 'testValue', undefined)
  })

  it('deve definir um cookie com opções', async () => {
    const cookieData: Cookie = {
      name: 'testCookie',
      value: 'testValue',
      options: {
        maxAge: 3600,
        path: '/',
        httpOnly: true,
        secure: true
      }
    }

    await cookieSet(cookieData)

    expect(mockSet).toHaveBeenCalledWith('testCookie', 'testValue', {
      maxAge: 3600,
      path: '/',
      httpOnly: true,
      secure: true
    })
  })

  it('não deve definir cookie quando value é undefined', async () => {
    const cookieData: Cookie = {
      name: 'testCookie',
      value: undefined
    }

    await cookieSet(cookieData)

    expect(mockSet).not.toHaveBeenCalled()
  })

  it('não deve definir cookie quando value é string vazia', async () => {
    const cookieData: Cookie = {
      name: 'testCookie',
      value: ''
    }

    await cookieSet(cookieData)

    expect(mockSet).not.toHaveBeenCalled()
  })

  it('deve definir cookie com nome que contém caracteres especiais', async () => {
    const cookieData: Cookie = {
      name: 'test-cookie_123',
      value: 'testValue'
    }

    await cookieSet(cookieData)

    expect(mockSet).toHaveBeenCalledWith('test-cookie_123', 'testValue', undefined)
  })

  it('deve definir cookie com valor que contém caracteres especiais', async () => {
    const cookieData: Cookie = {
      name: 'testCookie',
      value: 'test@value!#$%'
    }

    await cookieSet(cookieData)

    expect(mockSet).toHaveBeenCalledWith('testCookie', 'test@value!#$%', undefined)
  })
})

describe('cookieDelete', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve deletar um cookie pelo nome', async () => {
    const cookieData: Cookie = {
      name: 'testCookie'
    }

    await cookieDelete(cookieData)

    expect(mockDelete).toHaveBeenCalledWith('testCookie')
  })

  it('deve deletar cookie mesmo quando value é fornecido', async () => {
    const cookieData: Cookie = {
      name: 'testCookie',
      value: 'someValue'
    }

    await cookieDelete(cookieData)

    expect(mockDelete).toHaveBeenCalledWith('testCookie')
  })

  it('deve deletar cookie com nome que contém caracteres especiais', async () => {
    const cookieData: Cookie = {
      name: 'test-cookie_123'
    }

    await cookieDelete(cookieData)

    expect(mockDelete).toHaveBeenCalledWith('test-cookie_123')
  })
})

describe('cookieGet', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve retornar o valor do cookie quando existe', async () => {
    const expectedValue = 'testValue'
    mockGet.mockReturnValue({ value: expectedValue })

    const cookieData: Cookie = {
      name: 'testCookie'
    }

    const result = await cookieGet(cookieData)

    expect(mockGet).toHaveBeenCalledWith('testCookie')
    expect(result).toBe(expectedValue)
  })

  it('deve retornar undefined quando cookie não existe', async () => {
    mockGet.mockReturnValue(undefined)

    const cookieData: Cookie = {
      name: 'nonExistentCookie'
    }

    const result = await cookieGet(cookieData)

    expect(mockGet).toHaveBeenCalledWith('nonExistentCookie')
    expect(result).toBeUndefined()
  })

  it('deve retornar undefined quando cookie existe mas não tem valor', async () => {
    mockGet.mockReturnValue({})

    const cookieData: Cookie = {
      name: 'testCookie'
    }

    const result = await cookieGet(cookieData)

    expect(mockGet).toHaveBeenCalledWith('testCookie')
    expect(result).toBeUndefined()
  })

  it('deve buscar cookie com nome que contém caracteres especiais', async () => {
    const expectedValue = 'testValue'
    mockGet.mockReturnValue({ value: expectedValue })

    const cookieData: Cookie = {
      name: 'test-cookie_123'
    }

    const result = await cookieGet(cookieData)

    expect(mockGet).toHaveBeenCalledWith('test-cookie_123')
    expect(result).toBe(expectedValue)
  })

  it('deve retornar valor do cookie mesmo quando value é fornecido no input', async () => {
    const expectedValue = 'actualCookieValue'
    mockGet.mockReturnValue({ value: expectedValue })

    const cookieData: Cookie = {
      name: 'testCookie',
      value: 'inputValue' // Este valor deve ser ignorado
    }

    const result = await cookieGet(cookieData)

    expect(mockGet).toHaveBeenCalledWith('testCookie')
    expect(result).toBe(expectedValue)
  })
})