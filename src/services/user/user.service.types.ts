import { z } from 'zod'

import { schemaUserCreate, schemaUserGetByToken } from './user.service.schema'

export type UserCreate = z.infer<typeof schemaUserCreate>
export type UserGetByToken = z.infer<typeof schemaUserGetByToken>
