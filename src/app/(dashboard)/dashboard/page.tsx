import { LogoutButton } from '@/components/auth/logout'

export default function DashboardPage() {
  return (
    <div className='container mx-auto p-4'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Dashboard</h1>
        <LogoutButton />
      </div>
      <p>Bem-vindo ao dashboard!</p>
    </div>
  )
}
