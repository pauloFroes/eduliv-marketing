import { z } from 'zod'
import { schemaAuthLogin } from './schema'

export type AuthLogin = z.infer<typeof schemaAuthLogin>
