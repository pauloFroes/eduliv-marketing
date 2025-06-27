'use server'

import { getCookie } from '@/helpers/cookie'
import { hashPassword } from '@/helpers/crypt'
import { verifyJwt } from '@/helpers/jwt'
import { getFirstName } from '@/helpers/text'
import { ApiError } from '@/types'

import { appConfig } from '../../config/app'
import { db } from '../../config/db'
import { UserSession } from '../session.types'

import { schemaUserCreate, UserCreate } from '.'

export const createUser = async (userData: UserCreate): Promise<boolean | ApiError> => {
  try {
    const paramsValid = schemaUserCreate.safeParse(userData)
    if (!paramsValid.success) return false

    const { email, fullName, password } = paramsValid.data

    const userDb = await db.user.findUnique({ where: { email } })
    if (userDb) return 'alreadyExists'

    const passwordCrypt = await hashPassword(password)
    const displayName = getFirstName(fullName)

    const userDbCreated = await db.user.create({
      data: { email, fullName, displayName, password: passwordCrypt },
    })
    if (!userDbCreated) return false

    return true
  } catch {
    return false
  }
}

export const getUserByToken = async (): Promise<UserSession | false> => {
  const token = await getCookie({ name: appConfig.auth.tokenCookieName })
  if (!token) return false

  const decoded = verifyJwt(token)
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
