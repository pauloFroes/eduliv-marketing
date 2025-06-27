import { z } from 'zod'

import { schemaAuthLogin } from './auth.service.schema'

export type AuthLogin = z.infer<typeof schemaAuthLogin>
