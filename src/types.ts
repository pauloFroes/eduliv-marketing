export type ErrorType = 'invalidCredentials' | 'alreadyExists' | 'validationError' | 'internalError' | 'unauthorized'
export type ResponseType<T = void> = { success: true; data?: T } | { success: false; error: ErrorType }
