import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from 'react'
import { cn } from '../../lib/utils'

type ButtonVariant = 'primary' | 'secondary'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  icon?: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', disabled, icon, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center font-semibold transition-colors',
          variant === 'primary' && [
            'h-12 w-full rounded-md px-5 text-body-md text-white',
            'bg-blue-base hover:bg-blue-dark',
            'disabled:cursor-not-allowed disabled:opacity-50',
          ],
          variant === 'secondary' && [
            'h-8 gap-1.5 rounded px-2 text-body-sm font-semibold text-gray-500',
            'bg-gray-200 hover:border hover:border-blue-base',
            'disabled:cursor-not-allowed disabled:opacity-50',
          ],
          className,
        )}
        {...props}
      >
        {icon}
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
