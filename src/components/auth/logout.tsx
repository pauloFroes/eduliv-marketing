'use client'

import { useRouter } from 'next/navigation'

import { notificationToastPromise } from '@/helpers/notification/toast'
import { serviceAuthLogout } from '@/services/auth/service'

import { Button } from '../wrapper/button'

export const AuthLogout = ({ title }: { title: string }) => {
  const router = useRouter()

  const onSubmit = async () => {
    try {
      await notificationToastPromise({
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
    <Button type='button' onClick={onSubmit}>
      {title}
    </Button>
  )
}
