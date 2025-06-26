import bcrypt from 'bcrypt'

import { config } from '@/lib/config/config'

export const cryptHash = async (text: string): Promise<string> => {
  return await bcrypt.hash(text, config.auth.bcryptCost)
}

export const cryptVerify = async (text: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(text, hash)
}
