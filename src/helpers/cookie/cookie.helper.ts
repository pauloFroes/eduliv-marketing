import { cookies } from 'next/headers'

type Cookie = {
  name: string
  value?: string
  options?: {
    maxAge?: number
    path?: string
    httpOnly?: boolean
    secure?: boolean
  }
}

export const setCookie = async (params: Cookie): Promise<void> => {
  const { name, value, options } = params
  if (!value) return

  const cookieStore = await cookies()
  cookieStore.set(name, value, options)
}

export const deleteCookie = async ({ name }: Cookie): Promise<void> => {
  const cookieStore = await cookies()
  cookieStore.delete(name)
}

export const getCookie = async ({ name }: Cookie): Promise<string | undefined> => {
  const cookieStore = await cookies()
  return cookieStore.get(name)?.value
}
