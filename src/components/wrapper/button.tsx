import { Button as ButtonRoot } from '@/components/ui/button'
import { cn } from '@/lib/utils/utils'

interface ButtonProps {
  children: React.ReactNode
  type?: 'submit' | 'button' | 'reset'
  disabled?: boolean
  className?: string
  onClick?: () => void | Promise<void>
}

export const Button = ({ children, type = 'submit', disabled = false, className, onClick }: ButtonProps) => {
  return (
    <ButtonRoot className={cn('cursor-pointer', className)} size='lg' type={type} disabled={disabled} onClick={onClick}>
      {children}
    </ButtonRoot>
  )
}
