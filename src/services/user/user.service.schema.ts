import { z } from 'zod'

import { schemaUserEmail, schemaUserFullName, schemaUserPassword } from '../services.schema'

export const schemaUserCreate = z.object({
  fullName: schemaUserFullName,
  email: schemaUserEmail,
  password: schemaUserPassword,
})

export const schemaUserGetByToken = z.undefined()
