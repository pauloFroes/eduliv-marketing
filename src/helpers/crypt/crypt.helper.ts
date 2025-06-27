import bcrypt from 'bcrypt'

import { appConfig } from '@/config/app'

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, appConfig.auth.bcryptCost)
}

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash)
}
