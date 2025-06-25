import { z } from 'zod'
import { schemaAuthLogin, schemaAuthLogout, schemaAuthVerifyUserIdToken } from './schema'

export type AuthLogin = z.infer<typeof schemaAuthLogin>
export type AuthLogout = z.infer<typeof schemaAuthLogout>
export type AuthVerifyUserIdToken = z.infer<typeof schemaAuthVerifyUserIdToken>
