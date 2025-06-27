import { toast } from 'sonner'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ApiError, ApiResponse } from '@/types'

import { toastPromise } from './toast.helper'

// Mock do sonner
vi.mock('sonner', () => ({
  toast: {
    loading: vi.fn(() => 'toast-id'),
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('Toast Helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('toastPromise', () => {
    describe('quando a promise resolve com success: true', () => {
      it('deve mostrar toast de loading e depois toast de sucesso quando promise resolve com success: true', async () => {
        // Arrange
        const mockPromise = Promise.resolve({ success: true } as ApiResponse)
        const loadingMessage = 'Carregando dados...'
        const successMessage = 'Dados carregados com sucesso!'

        // Act
        await toastPromise({
          promise: mockPromise,
          loading: loadingMessage,
          success: successMessage,
        })

        // Assert
        expect(toast.loading).toHaveBeenCalledTimes(1)
        expect(toast.loading).toHaveBeenCalledWith(loadingMessage)
        expect(toast.success).toHaveBeenCalledTimes(1)
        expect(toast.success).toHaveBeenCalledWith(successMessage, { id: 'toast-id' })
        expect(toast.error).not.toHaveBeenCalled()
      })

      it('deve executar actionOnSuccess quando fornecido e promise resolve com success: true', async () => {
        // Arrange
        const mockPromise = Promise.resolve({ success: true } as ApiResponse)
        const mockActionOnSuccess = vi.fn()
        const loadingMessage = 'Salvando...'
        const successMessage = 'Salvo com sucesso!'

        // Act
        await toastPromise({
          promise: mockPromise,
          loading: loadingMessage,
          success: successMessage,
          actionOnSuccess: mockActionOnSuccess,
        })

        // Assert
        expect(toast.loading).toHaveBeenCalledTimes(1)
        expect(toast.loading).toHaveBeenCalledWith(loadingMessage)
        expect(toast.success).toHaveBeenCalledTimes(1)
        expect(toast.success).toHaveBeenCalledWith(successMessage, { id: 'toast-id' })
        expect(toast.error).not.toHaveBeenCalled()
        expect(mockActionOnSuccess).toHaveBeenCalledTimes(1)
        expect(mockActionOnSuccess).toHaveBeenCalledWith()
      })
    })

    describe('quando a promise resolve com success: false', () => {
      it('deve mostrar toast de loading e depois toast de erro com mensagem do errorMap quando error está mapeado', async () => {
        // Arrange
        const mockPromise = Promise.resolve({ success: false, error: 'validationError' as ApiError })
        const loadingMessage = 'Validando...'
        const successMessage = 'Validado com sucesso!'
        const errorMap = { validationError: 'Erro de validação encontrado' }

        // Act
        await toastPromise({
          promise: mockPromise,
          loading: loadingMessage,
          success: successMessage,
          errorMap,
        })

        // Assert
        expect(toast.loading).toHaveBeenCalledTimes(1)
        expect(toast.loading).toHaveBeenCalledWith(loadingMessage)
        expect(toast.error).toHaveBeenCalledTimes(1)
        expect(toast.error).toHaveBeenCalledWith('Erro de validação encontrado', { id: 'toast-id' })
        expect(toast.success).not.toHaveBeenCalled()
      })

      it('deve mostrar erro padrão quando errorMap não contém o erro específico', async () => {
        // Arrange
        const mockPromise = Promise.resolve({ success: false, error: 'invalidCredentials' as ApiError })
        const loadingMessage = 'Autenticando...'
        const successMessage = 'Autenticado com sucesso!'
        const errorMap = { validationError: 'Erro de validação' }

        // Act
        await toastPromise({
          promise: mockPromise,
          loading: loadingMessage,
          success: successMessage,
          errorMap,
        })

        // Assert
        expect(toast.loading).toHaveBeenCalledTimes(1)
        expect(toast.loading).toHaveBeenCalledWith(loadingMessage)
        expect(toast.error).toHaveBeenCalledTimes(1)
        expect(toast.error).toHaveBeenCalledWith('Erro inesperado', { id: 'toast-id' })
        expect(toast.success).not.toHaveBeenCalled()
      })

      it('deve mostrar erro padrão quando errorMap não é fornecido', async () => {
        // Arrange
        const mockPromise = Promise.resolve({ success: false, error: 'unauthorized' as ApiError })
        const loadingMessage = 'Verificando permissões...'
        const successMessage = 'Permissões verificadas!'

        // Act
        await toastPromise({
          promise: mockPromise,
          loading: loadingMessage,
          success: successMessage,
        })

        // Assert
        expect(toast.loading).toHaveBeenCalledTimes(1)
        expect(toast.loading).toHaveBeenCalledWith(loadingMessage)
        expect(toast.error).toHaveBeenCalledTimes(1)
        expect(toast.error).toHaveBeenCalledWith('Erro inesperado', { id: 'toast-id' })
        expect(toast.success).not.toHaveBeenCalled()
      })

      it('deve mostrar erro padrão quando error é undefined', async () => {
        // Arrange
        const mockPromise = Promise.resolve({ success: false, error: undefined })
        const loadingMessage = 'Processando...'
        const successMessage = 'Processado com sucesso!'

        // Act
        await toastPromise({
          promise: mockPromise,
          loading: loadingMessage,
          success: successMessage,
        })

        // Assert
        expect(toast.loading).toHaveBeenCalledTimes(1)
        expect(toast.loading).toHaveBeenCalledWith(loadingMessage)
        expect(toast.error).toHaveBeenCalledTimes(1)
        expect(toast.error).toHaveBeenCalledWith('Erro inesperado', { id: 'toast-id' })
        expect(toast.success).not.toHaveBeenCalled()
      })

      it('deve mostrar erro padrão quando resultado não possui propriedade success', async () => {
        // Arrange
        const mockPromise = Promise.resolve({ error: 'validationError' as ApiError } as ApiResponse)
        const loadingMessage = 'Processando...'
        const successMessage = 'Processado com sucesso!'
        const errorMap = { validationError: 'Erro de validação' }

        // Act
        await toastPromise({
          promise: mockPromise,
          loading: loadingMessage,
          success: successMessage,
          errorMap,
        })

        // Assert
        expect(toast.loading).toHaveBeenCalledTimes(1)
        expect(toast.loading).toHaveBeenCalledWith(loadingMessage)
        expect(toast.error).toHaveBeenCalledTimes(1)
        expect(toast.error).toHaveBeenCalledWith('Erro de validação', { id: 'toast-id' })
        expect(toast.success).not.toHaveBeenCalled()
      })

      it('deve não executar actionOnSuccess quando promise resolve com success: false', async () => {
        // Arrange
        const mockPromise = Promise.resolve({ success: false, error: 'validationError' as ApiError })
        const mockActionOnSuccess = vi.fn()
        const loadingMessage = 'Validando...'
        const successMessage = 'Validado com sucesso!'
        const errorMap = { validationError: 'Erro de validação' }

        // Act
        await toastPromise({
          promise: mockPromise,
          loading: loadingMessage,
          success: successMessage,
          errorMap,
          actionOnSuccess: mockActionOnSuccess,
        })

        // Assert
        expect(toast.loading).toHaveBeenCalledTimes(1)
        expect(toast.loading).toHaveBeenCalledWith(loadingMessage)
        expect(toast.error).toHaveBeenCalledTimes(1)
        expect(toast.error).toHaveBeenCalledWith('Erro de validação', { id: 'toast-id' })
        expect(toast.success).not.toHaveBeenCalled()
        expect(mockActionOnSuccess).not.toHaveBeenCalled()
      })
    })

    describe('quando a promise rejeita', () => {
      it('deve mostrar toast de loading e depois toast de erro padrão quando promise rejeita com Error', async () => {
        // Arrange
        const mockPromise = Promise.reject(new Error('Erro de rede'))
        const loadingMessage = 'Conectando...'
        const successMessage = 'Conectado com sucesso!'

        // Act
        await toastPromise({
          promise: mockPromise,
          loading: loadingMessage,
          success: successMessage,
        })

        // Assert
        expect(toast.loading).toHaveBeenCalledTimes(1)
        expect(toast.loading).toHaveBeenCalledWith(loadingMessage)
        expect(toast.error).toHaveBeenCalledTimes(1)
        expect(toast.error).toHaveBeenCalledWith('Erro inesperado', { id: 'toast-id' })
        expect(toast.success).not.toHaveBeenCalled()
      })

      it('deve mostrar toast de loading e depois toast de erro padrão quando rejeita com string', async () => {
        // Arrange
        const mockPromise = Promise.reject('Erro de validação')
        const loadingMessage = 'Validando...'
        const successMessage = 'Validado com sucesso!'

        // Act
        await toastPromise({
          promise: mockPromise,
          loading: loadingMessage,
          success: successMessage,
        })

        // Assert
        expect(toast.loading).toHaveBeenCalledTimes(1)
        expect(toast.loading).toHaveBeenCalledWith(loadingMessage)
        expect(toast.error).toHaveBeenCalledTimes(1)
        expect(toast.error).toHaveBeenCalledWith('Erro inesperado', { id: 'toast-id' })
        expect(toast.success).not.toHaveBeenCalled()
      })

      it('deve mostrar toast de loading e depois toast de erro padrão quando rejeita sem parâmetros', async () => {
        // Arrange
        const mockPromise = Promise.reject()
        const loadingMessage = 'Processando...'
        const successMessage = 'Processado com sucesso!'

        // Act
        await toastPromise({
          promise: mockPromise,
          loading: loadingMessage,
          success: successMessage,
        })

        // Assert
        expect(toast.loading).toHaveBeenCalledTimes(1)
        expect(toast.loading).toHaveBeenCalledWith(loadingMessage)
        expect(toast.error).toHaveBeenCalledTimes(1)
        expect(toast.error).toHaveBeenCalledWith('Erro inesperado', { id: 'toast-id' })
        expect(toast.success).not.toHaveBeenCalled()
      })

      it('deve não executar actionOnSuccess quando promise rejeita', async () => {
        // Arrange
        const mockPromise = Promise.reject(new Error('Erro de rede'))
        const mockActionOnSuccess = vi.fn()
        const loadingMessage = 'Conectando...'
        const successMessage = 'Conectado com sucesso!'

        // Act
        await toastPromise({
          promise: mockPromise,
          loading: loadingMessage,
          success: successMessage,
          actionOnSuccess: mockActionOnSuccess,
        })

        // Assert
        expect(toast.loading).toHaveBeenCalledTimes(1)
        expect(toast.loading).toHaveBeenCalledWith(loadingMessage)
        expect(toast.error).toHaveBeenCalledTimes(1)
        expect(toast.error).toHaveBeenCalledWith('Erro inesperado', { id: 'toast-id' })
        expect(toast.success).not.toHaveBeenCalled()
        expect(mockActionOnSuccess).not.toHaveBeenCalled()
      })
    })

    describe('mapeamento de erros', () => {
      it('deve mapear todos os tipos de erro conhecidos corretamente quando errorMap contém todos os erros', async () => {
        // Arrange
        const errorMap = {
          validationError: 'Erro de validação',
          invalidCredentials: 'Credenciais inválidas',
          unauthorized: 'Não autorizado',
          alreadyExists: 'Registro já existe',
          internalError: 'Erro interno do servidor',
          notFound: 'Recurso não encontrado',
          forbidden: 'Acesso negado',
          conflict: 'Conflito de dados',
        }

        // Teste para cada tipo de erro
        for (const [errorType, expectedMessage] of Object.entries(errorMap)) {
          const mockPromise = Promise.resolve({ success: false, error: errorType as ApiError })

          // Act
          await toastPromise({
            promise: mockPromise,
            loading: 'Processando...',
            success: 'Processado com sucesso!',
            errorMap,
          })

          // Assert
          expect(toast.error).toHaveBeenCalledWith(expectedMessage, { id: 'toast-id' })
          vi.clearAllMocks()
        }
      })

      it('deve usar errorMap parcial com apenas alguns tipos de erro quando error está mapeado', async () => {
        // Arrange
        const mockPromise = Promise.resolve({ success: false, error: 'validationError' as ApiError })
        const partialErrorMap = { validationError: 'Erro de validação' }
        const loadingMessage = 'Validando...'
        const successMessage = 'Validado com sucesso!'

        // Act
        await toastPromise({
          promise: mockPromise,
          loading: loadingMessage,
          success: successMessage,
          errorMap: partialErrorMap,
        })

        // Assert
        expect(toast.loading).toHaveBeenCalledTimes(1)
        expect(toast.loading).toHaveBeenCalledWith(loadingMessage)
        expect(toast.error).toHaveBeenCalledTimes(1)
        expect(toast.error).toHaveBeenCalledWith('Erro de validação', { id: 'toast-id' })
        expect(toast.success).not.toHaveBeenCalled()
      })

      it('deve usar erro padrão para tipos não mapeados no errorMap parcial quando error não está mapeado', async () => {
        // Arrange
        const mockPromise = Promise.resolve({ success: false, error: 'unauthorized' as ApiError })
        const partialErrorMap = { validationError: 'Erro de validação' }
        const loadingMessage = 'Verificando...'
        const successMessage = 'Verificado com sucesso!'

        // Act
        await toastPromise({
          promise: mockPromise,
          loading: loadingMessage,
          success: successMessage,
          errorMap: partialErrorMap,
        })

        // Assert
        expect(toast.loading).toHaveBeenCalledTimes(1)
        expect(toast.loading).toHaveBeenCalledWith(loadingMessage)
        expect(toast.error).toHaveBeenCalledTimes(1)
        expect(toast.error).toHaveBeenCalledWith('Erro inesperado', { id: 'toast-id' })
        expect(toast.success).not.toHaveBeenCalled()
      })
    })

    describe('comportamento do actionOnSuccess', () => {
      it('deve executar actionOnSuccess apenas quando promise resolve com success: true', async () => {
        // Arrange
        const mockActionOnSuccess = vi.fn()
        const loadingMessage = 'Processando...'
        const successMessage = 'Processado com sucesso!'

        // Teste com success: true
        const successPromise = Promise.resolve({ success: true } as ApiResponse)
        await toastPromise({
          promise: successPromise,
          loading: loadingMessage,
          success: successMessage,
          actionOnSuccess: mockActionOnSuccess,
        })

        // Assert
        expect(mockActionOnSuccess).toHaveBeenCalledTimes(1)
        expect(mockActionOnSuccess).toHaveBeenCalledWith()

        // Reset mock
        vi.clearAllMocks()
        mockActionOnSuccess.mockClear()

        // Teste com success: false
        const failurePromise = Promise.resolve({ success: false, error: 'validationError' as ApiError })
        await toastPromise({
          promise: failurePromise,
          loading: loadingMessage,
          success: successMessage,
          actionOnSuccess: mockActionOnSuccess,
        })

        // Assert
        expect(mockActionOnSuccess).not.toHaveBeenCalled()

        // Reset mock
        vi.clearAllMocks()
        mockActionOnSuccess.mockClear()

        // Teste com promise rejeitada
        const rejectedPromise = Promise.reject(new Error('Erro'))
        await toastPromise({
          promise: rejectedPromise,
          loading: loadingMessage,
          success: successMessage,
          actionOnSuccess: mockActionOnSuccess,
        })

        // Assert
        expect(mockActionOnSuccess).not.toHaveBeenCalled()
      })

      it('deve funcionar corretamente sem actionOnSuccess fornecido quando promise resolve com success: true', async () => {
        // Arrange
        const mockPromise = Promise.resolve({ success: true } as ApiResponse)
        const loadingMessage = 'Processando...'
        const successMessage = 'Processado com sucesso!'

        // Act
        await toastPromise({
          promise: mockPromise,
          loading: loadingMessage,
          success: successMessage,
        })

        // Assert
        expect(toast.loading).toHaveBeenCalledTimes(1)
        expect(toast.loading).toHaveBeenCalledWith(loadingMessage)
        expect(toast.success).toHaveBeenCalledTimes(1)
        expect(toast.success).toHaveBeenCalledWith(successMessage, { id: 'toast-id' })
        expect(toast.error).not.toHaveBeenCalled()
      })
    })

    describe('gerenciamento do toast ID', () => {
      it('deve usar o mesmo toast ID para loading e success quando promise resolve com success: true', async () => {
        // Arrange
        const mockPromise = Promise.resolve({ success: true } as ApiResponse)
        const loadingMessage = 'Processando...'
        const successMessage = 'Processado com sucesso!'

        // Act
        await toastPromise({
          promise: mockPromise,
          loading: loadingMessage,
          success: successMessage,
        })

        // Assert
        expect(toast.loading).toHaveBeenCalledWith(loadingMessage)
        expect(toast.success).toHaveBeenCalledWith(successMessage, { id: 'toast-id' })
      })

      it('deve usar o mesmo toast ID para loading e error quando promise resolve com success: false', async () => {
        // Arrange
        const mockPromise = Promise.resolve({ success: false, error: 'validationError' as ApiError })
        const loadingMessage = 'Validando...'
        const successMessage = 'Validado com sucesso!'
        const errorMap = { validationError: 'Erro de validação' }

        // Act
        await toastPromise({
          promise: mockPromise,
          loading: loadingMessage,
          success: successMessage,
          errorMap,
        })

        // Assert
        expect(toast.loading).toHaveBeenCalledWith(loadingMessage)
        expect(toast.error).toHaveBeenCalledWith('Erro de validação', { id: 'toast-id' })
      })

      it('deve usar o mesmo toast ID para loading e error quando promise rejeita', async () => {
        // Arrange
        const mockPromise = Promise.reject(new Error('Erro de rede'))
        const loadingMessage = 'Conectando...'
        const successMessage = 'Conectado com sucesso!'

        // Act
        await toastPromise({
          promise: mockPromise,
          loading: loadingMessage,
          success: successMessage,
        })

        // Assert
        expect(toast.loading).toHaveBeenCalledWith(loadingMessage)
        expect(toast.error).toHaveBeenCalledWith('Erro inesperado', { id: 'toast-id' })
      })
    })
  })
})
