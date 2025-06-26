export type ErrorType = 'invalidCredentials' | 'alreadyExists' | 'validationError' | 'internalError' | 'unauthorized'

export interface ResponsePromise<T = undefined> {
  success: boolean
  data?: T
  error?: ErrorType
}
