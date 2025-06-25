import { FormAuthLogin } from '@/components/form/auth'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export default function Login() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <Card className='w-full max-w-sm'>
        <CardHeader>
          <CardTitle className='text-2xl text-center'>Entrar</CardTitle>
          <CardDescription className='text-center'>Acesse sua conta para continuar</CardDescription>
        </CardHeader>
        <CardContent>
          <FormAuthLogin />
        </CardContent>
      </Card>
    </div>
  )
}
