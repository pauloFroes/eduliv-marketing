'use server'

import { appConfig } from '@/config/app'
import { db } from '@/config/db'
import { deleteCookie, getCookie, setCookie } from '@/helpers/cookie'
import { verifyCrypt } from '@/helpers/crypt'
import { signJwt, verifyJwt } from '@/helpers/jwt'
import { ApiResponse } from '@/types'

import { schemaAuthLogin } from './auth.service.schema'
import { AuthLogin } from './auth.service.types'

export const authenticateUser = async (credentials: AuthLogin): Promise<ApiResponse> => {
  const paramsValid = schemaAuthLogin.safeParse(credentials)
  if (!paramsValid.success) return { success: false, error: 'validationError' }
  const { email, password } = paramsValid.data

  const userDb = await db.user.findUnique({ where: { email } })
  if (!userDb) return { success: false, error: 'invalidCredentials' }

  const passwordValid = await verifyCrypt(password, userDb.password)
  if (!passwordValid) return { success: false, error: 'invalidCredentials' }

  const token = signJwt({ userId: userDb.id })
  const maxAge = 60 * 60 * 24 * 30
  const secure = appConfig.auth.isProduction
  const options = { maxAge, httpOnly: true, path: '/', secure }
  const cookieName = appConfig.auth.tokenCookieName
  await setCookie({ name: cookieName, value: token, options })

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
