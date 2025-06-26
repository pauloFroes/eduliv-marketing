'use server'

import { cookieDelete, cookieGet, cookieSet } from '@/helpers/cookie'
import { jwtSign, jwtVerify } from '@/helpers/jwt'
import { pwdVerify } from '@/helpers/pwd'
import { db } from '@/lib/db'
import { ResponsePromise } from '@/types'

import { schemaAuthLogin } from './schema'
import { AuthLogin } from './types'

const isProduction = process.env.NODE_ENV === 'production'
const TOKEN_COOKIE_NAME = process.env.TOKEN_COOKIE_NAME
if (!TOKEN_COOKIE_NAME) throw new Error('TOKEN_COOKIE_NAME is not set')

export const serviceAuthLogin = async (params: AuthLogin): Promise<ResponsePromise> => {
  const paramsValid = schemaAuthLogin.safeParse(params)
  if (!paramsValid.success) return { success: false, error: 'validationError' }
  const { email, password } = paramsValid.data

  const userDb = await db.user.findUnique({ where: { email } })
  if (!userDb) return { success: false, error: 'invalidCredentials' }

  const passwordValid = await pwdVerify(password, userDb.password)
  if (!passwordValid) return { success: false, error: 'invalidCredentials' }

  const token = jwtSign({ userId: userDb.id })
  await cookieSet({
    name: TOKEN_COOKIE_NAME,
    value: token,
    options: { maxAge: 60 * 60 * 24 * 30, httpOnly: true, path: '/', secure: isProduction },
  })

  return { success: true }
}

export const serviceAuthLogout = async (): Promise<ResponsePromise> => {
  const token = await cookieGet({ name: TOKEN_COOKIE_NAME })
  if (!token) return { success: false, error: 'unauthorized' }

  await cookieDelete({ name: TOKEN_COOKIE_NAME })
  return { success: true }
}

export const serviceAuthVerifyUserIdToken = async (): Promise<ResponsePromise> => {
  const token = await cookieGet({ name: TOKEN_COOKIE_NAME })
  if (!token) return { success: false, error: 'unauthorized' }

  const decoded = jwtVerify(token)
  if (!decoded) return { success: false, error: 'unauthorized' }

  const userDb = await db.user.findUnique({ where: { id: decoded.userId } })
  if (!userDb) return { success: false, error: 'unauthorized' }

  return { success: true }
}
