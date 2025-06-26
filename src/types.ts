export type ErrorType =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'NOT_FOUND'
  | 'INTERNAL_ERROR'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR'
  | 'invalidCredentials'
  | 'alreadyExists'
  | 'validationError'
  | 'internalError'
  | 'unauthorized'

export interface ResponsePromise<T> {
  success: boolean
  data?: T
  error?: ErrorType
}
