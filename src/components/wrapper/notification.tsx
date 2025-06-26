import { TooltipContent, Tooltip as TooltipRoot, TooltipTrigger } from '@/components/ui/tooltip'

interface NotificationTooltipProps {
  children: React.ReactNode
  description: string
}

export const NotificationTooltip = ({ children, description }: NotificationTooltipProps) => {
  return (
    <TooltipRoot>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent>{description}</TooltipContent>
    </TooltipRoot>
  )
}
