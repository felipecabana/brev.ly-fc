import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from 'react'
import { cn } from '../../lib/utils'
import { Spinner } from './spinner'

type ButtonVariant = 'primary' | 'secondary'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  icon?: ReactNode
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      disabled,
      loading = false,
      icon,
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading}
        className={cn(
          'inline-flex items-center justify-center font-semibold transition-colors duration-200 ease-in-out',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-base',
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
        {loading ? (
          <Spinner
            size="sm"
            label="Carregando"
            className={
              variant === 'primary'
                ? 'border-white/40 border-t-white'
                : undefined
            }
          />
        ) : (
          <>
            {icon}
            {children}
          </>
        )}
      </button>
    )
  },
)

Button.displayName = 'Button'
