import { redirect } from 'next/navigation'

import { verifyUserToken } from '@/services/auth/auth.service'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const authResult = await verifyUserToken()
  if (!authResult.success) redirect('/login')

  return <>{children}</>
}
