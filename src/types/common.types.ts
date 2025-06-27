export type ApiError = 'invalidCredentials' | 'alreadyExists' | 'validationError' | 'internalError' | 'unauthorized'

export type ApiResponse<T = undefined> = {
  success: boolean
  data?: T
  error?: ApiError
}
