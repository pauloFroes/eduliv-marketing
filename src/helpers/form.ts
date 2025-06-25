import { toast } from 'sonner'
import { ErrorType, ResponseType } from '@/types'

interface FormToast<T> {
  promise: Promise<ResponseType<T>>
  loading: string
  success: string
  errorMap?: Partial<Record<ErrorType, string>>
}

export const formToast = async <T>({ promise, loading, success, errorMap }: FormToast<T>) => {
  return toast.promise(
    (async () => {
      const res = await promise
      if (res.success) return res.data
      if (!res.success) throw new Error(res.error)
      throw new Error('validation-error')
    })(),
    {
      loading,
      success,
      error: err => {
        const errorMapMsg = errorMap?.[err.message as ErrorType]
        if (errorMapMsg) return errorMapMsg
        return 'Erro inesperado. Tente novamente.'
      },
    },
  )
}
