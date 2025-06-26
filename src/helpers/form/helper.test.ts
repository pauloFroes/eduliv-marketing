import { describe, expect, it, vi } from 'vitest'

import { formToast } from './helper'
import { ErrorType } from '@/types'

// Mock do toast - simplificado
vi.mock('sonner', () => ({
  toast: {
    promise: vi.fn(() => Promise.resolve())
  }
}))

describe('formToast', () => {
  it('deve ser uma função', () => {
    expect(typeof formToast).toBe('function')
  })

  it('deve aceitar os parâmetros obrigatórios', () => {
    const params = {
      promise: Promise.resolve({ success: true, data: {} }),
      loading: 'Carregando...',
      success: 'Sucesso!'
    }

    expect(() => formToast(params)).not.toThrow()
  })

  it('deve aceitar errorMap como parâmetro opcional', () => {
    const params = {
      promise: Promise.resolve({ success: false, error: 'VALIDATION_ERROR' as ErrorType }),
      loading: 'Carregando...',
      success: 'Sucesso!',
      errorMap: { 'VALIDATION_ERROR': 'Erro de validação' }
    }

    expect(() => formToast(params)).not.toThrow()
  })

  it('deve aceitar actionOnSuccess como parâmetro opcional', () => {
    const params = {
      promise: Promise.resolve({ success: true, data: {} }),
      loading: 'Carregando...',
      success: 'Sucesso!',
      actionOnSuccess: vi.fn()
    }

    expect(() => formToast(params)).not.toThrow()
  })
})