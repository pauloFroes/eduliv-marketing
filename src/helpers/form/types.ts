import { ErrorType, ResponsePromise } from '@/types'

interface FormToast<T> {
  promise: Promise<ResponsePromise<T>>
  loading: string
  success: string
  errorMap?: Partial<Record<ErrorType, string>>
  actionOnSuccess?: () => void
}

export type { FormToast }
