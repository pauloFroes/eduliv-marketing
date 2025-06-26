'use client'

import { useRouter } from 'next/navigation'

import { formToast } from '@/helpers/form/form'
import { serviceAuthLogout } from '@/services/auth/service'

export const AuthLogout = ({ title }: { title: string }) => {
  const router = useRouter()

  const onSubmit = async () => {
    try {
      await formToast({
        promise: serviceAuthLogout(),
        loading: 'Efetuando logout...',
        success: 'Logout realizado com sucesso!',
        actionOnSuccess: () => router.push('/login'),
      })
    } catch {
      return
    }
  }

  return (
    <span onClick={onSubmit} className='cursor-pointer'>
      {title}
    </span>
  )
}
