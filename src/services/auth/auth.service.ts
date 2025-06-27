'use server'

import { deleteCookie, getCookie, setCookie } from '@/helpers/cookie'
import { verifyPassword } from '@/helpers/crypt'
import { signJwt, verifyJwt } from '@/helpers/jwt'
import { appConfig } from '@/lib/config'
import { db } from '@/lib/db'
import { ApiResponse } from '@/types'

import { AuthLogin } from './auth.types'
import { schemaAuthLogin } from './schema'

const isProduction = process.env.NODE_ENV === 'production'

export const authenticateUser = async (credentials: AuthLogin): Promise<ApiResponse> => {
  const paramsValid = schemaAuthLogin.safeParse(credentials)
  if (!paramsValid.success) return { success: false, error: 'validationError' }
  const { email, password } = paramsValid.data

  const userDb = await db.user.findUnique({ where: { email } })
  if (!userDb) return { success: false, error: 'invalidCredentials' }

  const passwordValid = await verifyPassword(password, userDb.password)
  if (!passwordValid) return { success: false, error: 'invalidCredentials' }

  const token = signJwt({ userId: userDb.id })
  await setCookie({
    name: appConfig.auth.tokenCookieName,
    value: token,
    options: { maxAge: 60 * 60 * 24 * 30, httpOnly: true, path: '/', secure: isProduction },
  })

  return { success: true }
}

export const logoutUser = async (): Promise<ApiResponse> => {
  const token = await getCookie({ name: appConfig.auth.tokenCookieName })
  if (!token) return { success: false, error: 'unauthorized' }

  await deleteCookie({ name: appConfig.auth.tokenCookieName })
  return { success: true }
}

export const verifyUserToken = async (): Promise<ApiResponse> => {
  const token = await getCookie({ name: appConfig.auth.tokenCookieName })
  if (!token) return { success: false, error: 'unauthorized' }

  const decoded = verifyJwt(token)
  if (!decoded) return { success: false, error: 'unauthorized' }

  const userDb = await db.user.findUnique({ where: { id: decoded.userId } })
  if (!userDb) return { success: false, error: 'unauthorized' }

  return { success: true }
}
