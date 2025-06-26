import bcrypt from 'bcrypt'

import { config } from '@/lib/config/config'

export const pwdCrypt = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, config.auth.bcryptCost)
}

export const pwdVerify = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash)
}