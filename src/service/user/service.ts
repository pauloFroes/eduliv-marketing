/**
 * Pendências do serviço de criação de usuário
 *    - Validar privilégios de criação de usuário. Somente admin pode criar usuário
 *  **/

'use server'

import { db } from '@/lib/db'
import { schemaUserCreate, schemaUserGetByToken } from './schema'
import { UserCreate, UserGetByToken } from './types'
import { pwdCrypt } from '@/helpers/pwd'
import { textFirstName } from '@/helpers/text'
import { UserSession } from '../types'
import { cookieGet } from '@/helpers/cookie'
import { jwtVerify } from '@/helpers/jwt'
import { ErrorType } from '@/types'

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

  const token = await cookieGet({ name: 'token' })
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
