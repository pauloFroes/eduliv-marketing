'use client'

import { useRouter } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { FormInput } from '@/components/form/form'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/wrapper/button'
import { notificationToastPromise } from '@/helpers/notification/toast'
import { schemaAuthLogin } from '@/services/auth/schema'
import { serviceAuthLogin } from '@/services/auth/service'
import { AuthLogin } from '@/services/auth/types'

export const AuthFormLogin = () => {
  const router = useRouter()

  const onSubmit = async (formData: AuthLogin) => {
    try {
      await notificationToastPromise({
        promise: serviceAuthLogin(formData),
        loading: 'Efetuando login...',
        success: 'Login realizado com sucesso!',
        errorMap: { invalidCredentials: 'E-mail ou senha inválidos.' },
        actionOnSuccess: () => router.push('/dashboard'),
      })
    } catch {
      return
    }
  }

  const form = useForm<AuthLogin>({
    resolver: zodResolver(schemaAuthLogin),
    defaultValues: { email: '', password: '' },
  })

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        <div className='space-y-4'>
          <FormInput label='Email' tooltip='Informe seu email' name='email' placeholder='email@exemplo.com.br' />
          <FormInput
            label='Senha'
            tooltip='Informe sua senha'
            name='password'
            type='password'
            placeholder='***********'
          />
        </div>
        <div>
          <Button type='submit' disabled={isSubmitting} className='w-full'>
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
