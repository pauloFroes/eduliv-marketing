import jwt from 'jsonwebtoken'

import { config } from '@/lib/config/config'

import { JwtPayload } from './types'

export const jwtSign = (payload: JwtPayload): string => {
  return jwt.sign(payload, config.auth.jwtSecret!, { expiresIn: config.auth.jwtExpiresIn })
}

export const jwtVerify = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.verify(token, config.auth.jwtSecret!) as JwtPayload
    return decoded
  } catch {
    return null
  }
}