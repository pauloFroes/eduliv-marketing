import { InputHTMLAttributes } from 'react'

import { Info } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

import { FormControl, FormField, FormItem, FormLabel } from './ui/form'
import { Input } from './ui/input'
import { NotificationTooltip } from './wrapper/notification'

interface FormFieldProps {
  label: string
  tooltip: string
  name: string
  type?: InputHTMLAttributes<HTMLInputElement>['type']
  placeholder?: string
}

export const FormInput = (props: FormFieldProps) => {
  const {
    control,
    formState: { errors, isSubmitting },
  } = useFormContext()

  const { label, tooltip, name, type = 'text', placeholder } = props

  const errorMessage = errors[name]?.message?.toString()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className='flex items-center justify-between'>
            <FormLabel>{label}</FormLabel>
            <NotificationTooltip description={errorMessage ?? tooltip}>
              <Info className={`h-4 w-4 ${errorMessage ? 'text-red-500' : `text-gray-500`}`} />
            </NotificationTooltip>
          </div>
          <FormControl>
            <Input {...field} type={type} disabled={isSubmitting} placeholder={placeholder} />
          </FormControl>
        </FormItem>
      )}
    />
  )
}
