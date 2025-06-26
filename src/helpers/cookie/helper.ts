import { cookies } from 'next/headers'

import { Cookie } from './types'

export const cookieSet = async (params: Cookie): Promise<void> => {
  const { name, value, options } = params
  if (!value) return

  const cookieStore = await cookies()
  cookieStore.set(name, value, options)
}

export const cookieDelete = async ({ name }: Cookie): Promise<void> => {
  const cookieStore = await cookies()
  cookieStore.delete(name)
}

export const cookieGet = async ({ name }: Cookie): Promise<string | undefined> => {
  const cookieStore = await cookies()
  return cookieStore.get(name)?.value
}
