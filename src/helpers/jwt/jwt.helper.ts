import jwt from 'jsonwebtoken'

import { appConfig } from '@/lib/config'

type JwtPayload = {
  userId: string
  iat: number
  exp: number
}

export const signJwt = (payload: object): string => {
  return jwt.sign(payload, appConfig.auth.jwtSecret, {
    expiresIn: `${appConfig.auth.jwtExpiresIn}h`,
  })
}

export const verifyJwt = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, appConfig.auth.jwtSecret) as JwtPayload
  } catch {
    return null
  }
}
