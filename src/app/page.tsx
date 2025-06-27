import { redirect } from 'next/navigation'

import { verifyUserToken } from '@/services/auth'

export default async function HomePage() {
  const authToken = await verifyUserToken()
  if (!authToken) redirect('/login')
  redirect('/dashboard')
}
