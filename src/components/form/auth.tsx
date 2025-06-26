'use client'

import { useRouter } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { formToast } from '@/helpers/form/form'
import { schemaAuthLogin } from '@/service/auth/schema'
import { serviceAuthLogin } from '@/service/auth/service'
import { AuthLogin } from '@/service/auth/types'

import { Button } from '../ui/button'
import { Input } from '../ui/input'

export const FormAuthLogin = () => {
  const router = useRouter()

  const onSubmit = async (formData: AuthLogin) => {
    try {
      await formToast({
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
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        <div className='space-y-4'>
          <FormField
            control={control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='Informe seu email' disabled={isSubmitting} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='***********' disabled={isSubmitting} type='password' />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div>
          <Button type='submit' className='w-full' size='lg' disabled={isSubmitting}>
            {!isSubmitting ? 'Entrar' : 'Entrando...'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
