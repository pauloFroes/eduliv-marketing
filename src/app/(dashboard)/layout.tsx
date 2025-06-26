import { redirect } from 'next/navigation'

import { serviceAuthVerifyUserIdToken } from '@/services/auth/service'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const authResult = await serviceAuthVerifyUserIdToken()
  if (!authResult.success) redirect('/login')

  return <div>{children}</div>
}
