import { toast } from 'sonner'

import { ApiError } from '@/types'

import { NotificationToastPromiseParams } from './notification.types'

export const notificationToastPromise = async ({
  promise,
  loading,
  success,
  errorMap,
  actionOnSuccess,
}: NotificationToastPromiseParams) => {
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
