import { ApiError, ApiResponse } from '@/types'

export type NotificationToastPromiseParams = {
  promise: Promise<ApiResponse>
  loading: string
  success: string
  errorMap?: Partial<Record<ApiError, string>>
  actionOnSuccess?: () => void
}
