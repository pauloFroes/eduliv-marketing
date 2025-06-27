import bcrypt from 'bcrypt'

import { appConfig } from '@/config/app'

export const cryptApply = async (password: string): Promise<string> => {
  return bcrypt.hash(password, appConfig.auth.bcryptCost)
}

export const verifyCrypt = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash)
}
