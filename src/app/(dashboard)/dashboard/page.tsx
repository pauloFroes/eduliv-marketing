import { AuthLogout } from '@/components/auth/logout'

export default function DashboardPage() {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <AuthLogout title='Sair' />
    </div>
  )
}
