import { toast } from 'sonner'

import { ErrorType } from '@/types'

import { FormToast } from './types'

export const formToast = <T>({
  promise,
  loading,
  success,
  errorMap,
  actionOnSuccess = () => {},
}: FormToast<T>): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    toast.promise(
      promise.then(res => {
        if (!res.success) return Promise.reject(res.error)
        actionOnSuccess()
        return res.data as T
      }),
      {
        loading,
        success: (data: T) => {
          resolve(data)
          return success
        },
        error: (err: Error) => {
          const error = err as unknown as ErrorType
          const msg = errorMap?.[error] ?? 'Erro inesperado. Tente novamente.'
          reject(msg)
          return msg
        },
      },
    )
  })
}