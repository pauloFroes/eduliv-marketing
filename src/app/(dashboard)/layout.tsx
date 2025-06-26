import { serviceAuthVerifyUserIdToken } from '@/service/auth/service'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const authResult = await serviceAuthVerifyUserIdToken()
  if (!authResult.success) redirect('/login')

  return <div>{children}</div>
}
