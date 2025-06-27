import { z } from 'zod'

import { schemaUserEmail, schemaUserPassword } from '../services.schema'

export const schemaAuthLogin = z.object({
  email: schemaUserEmail,
  password: schemaUserPassword,
})
