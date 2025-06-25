'use server'

import { db } from '@/lib/db'
import { schemaAuthLogin, schemaAuthLogout, schemaAuthVerifyUserIdToken } from './schema'
import { AuthLogout, AuthVerifyUserIdToken } from './types'
import { cookieDelete, cookieGet, cookieSet } from '@/helpers/cookie'
import { jwtSign, jwtVerify } from '@/helpers/jwt'
import { AuthLogin } from './types'
import { pwdVerify } from '@/helpers/pwd'
import { ResponseType } from '@/types'

const isProduction = process.env.NODE_ENV === 'production'

export const serviceAuthLogin = async (params: AuthLogin): Promise<ResponseType> => {
  const paramsValid = schemaAuthLogin.safeParse(params)
  if (!paramsValid.success) return { success: false, error: 'validationError' }
  const { email, password } = paramsValid.data

  const userDb = await db.user.findUnique({ where: { email } })
  if (!userDb) return { success: false, error: 'invalidCredentials' }

  const passwordValid = await pwdVerify(password, userDb.password)
  if (!passwordValid) return { success: false, error: 'invalidCredentials' }

  const token = jwtSign({ userId: userDb.id })
  await cookieSet({
    name: 'token',
    value: token,
    options: { maxAge: 60 * 60 * 24 * 30, httpOnly: true, path: '/', secure: isProduction },
  })

  return { success: true }
}

export const serviceAuthLogout = async (params: AuthLogout): Promise<ResponseType> => {
  const paramsValid = schemaAuthLogout.safeParse(params)
  if (!paramsValid.success) return { success: false, error: 'validationError' }

  const token = await cookieGet({ name: 'token' })
  if (!token) return { success: false, error: 'unauthorized' }

  await cookieDelete({ name: 'token' })
  return { success: true }
}

export const serviceAuthVerifyUserIdToken = async (params: AuthVerifyUserIdToken): Promise<ResponseType> => {
  const paramsValid = schemaAuthVerifyUserIdToken.safeParse(params)
  if (!paramsValid.success) return { success: false, error: 'validationError' }

  const token = await cookieGet({ name: 'token' })
  if (!token) return { success: false, error: 'unauthorized' }

  const decoded = jwtVerify(token)
  if (!decoded) return { success: false, error: 'unauthorized' }

  const userDb = await db.user.findUnique({ where: { id: decoded.userId } })
  if (!userDb) return { success: false, error: 'unauthorized' }

  return { success: true }
}
