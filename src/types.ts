export type ErrorType = 'invalidCredentials' | 'alreadyExists' | 'validationError' | 'internalError' | 'unauthorized'
export type ResponsePromise<T = void> = { success: true; data?: T } | { success: false; error: ErrorType }
