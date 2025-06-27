import { toast } from 'sonner'

import { ApiError, ApiResponse } from '@/types'

type ToastPromiseParams = {
  promise: Promise<ApiResponse>
  loading: string
  success: string
  errorMap?: Partial<Record<ApiError, string>>
  actionOnSuccess?: () => void
}

export const toastPromise = async ({ promise, loading, success, errorMap, actionOnSuccess }: ToastPromiseParams) => {
  const toastId = toast.loading(loading)

  try {
    const result = await promise

    if (result.success) {
      toast.success(success, { id: toastId })
      actionOnSuccess?.()
    } else {
      const errorMessage = errorMap?.[result.error as ApiError] || 'Erro inesperado'
      toast.error(errorMessage, { id: toastId })
    }
  } catch {
    toast.error('Erro inesperado', { id: toastId })
  }
}
