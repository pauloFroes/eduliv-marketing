'use client'

import { useRouter } from 'next/navigation'

import { logoutUser } from '@/services/auth/auth.service'

export const LogoutButton = () => {
  const router = useRouter()

  const handleLogout = async () => {
    await logoutUser()
    router.push('/login')
  }

  return (
    <button onClick={handleLogout} className='text-red-600 hover:text-red-800'>
      Sair
    </button>
  )
}
