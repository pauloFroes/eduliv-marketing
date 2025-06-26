/**
 * Pendências do serviço de criação de usuário
 *    - Validar privilégios de criação de usuário. Somente admin pode criar usuário
 *  **/

'use server'

import { cookieGet } from '@/helpers/cookie/helper'
import { jwtVerify } from '@/helpers/jwt/helper'
import { pwdCrypt } from '@/helpers/pwd/helper'
import { textFirstName } from '@/helpers/text/helper'
import { config } from '@/lib/config/config'
import { db } from '@/lib/db/db'
import { ErrorType } from '@/types'

import { UserSession } from '../types'

import { schemaUserCreate, schemaUserGetByToken } from './schema'
import { UserCreate, UserGetByToken } from './types'

/**
 * Pendências do serviço de criação de usuário
 *    - Validar privilégios de criação de usuário. Somente admin pode criar usuário
 *  **/

/**
 * Pendências do serviço de criação de usuário
 *    - Validar privilégios de criação de usuário. Somente admin pode criar usuário
 *  **/

export const serviceUserCreate = async (params: UserCreate): Promise<boolean | ErrorType> => {
  const paramsValid = schemaUserCreate.safeParse(params)
  if (!paramsValid.success) return false

  const { email, fullName, password } = paramsValid.data

  const userDb = await db.user.findUnique({ where: { email } })
  if (userDb) return 'alreadyExists'

  const passwordCrypt = await pwdCrypt(password)
  const displayName = textFirstName(fullName)

  const userDbCreated = await db.user.create({
    data: { email, fullName, displayName, password: passwordCrypt },
  })
  if (!userDbCreated) return false

  return true
}

export const serviceUserGetByToken = async (params: UserGetByToken): Promise<UserSession | false> => {
  const paramsValid = schemaUserGetByToken.safeParse(params)
  if (!paramsValid.success) return false

  const token = await cookieGet({ name: config.auth.tokenCookieName })
  if (!token) return false

  const decoded = jwtVerify(token)
  if (!decoded) return false

  const userDb = await db.user.findUnique({
    where: { id: decoded.userId },
    select: { email: true, displayName: true, phone: true, fullName: true },
  })
  if (!userDb) return false

  return {
    email: userDb.email,
    displayName: userDb.displayName,
    phone: userDb.phone ?? undefined,
  }
}
