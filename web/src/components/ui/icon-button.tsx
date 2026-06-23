import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '../../lib/utils'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, children, type = 'button', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'inline-flex size-8 items-center justify-center rounded bg-gray-200 text-gray-500 transition-colors duration-200 ease-in-out',
          'hover:border hover:border-blue-base',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-base',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      >
        {children}
      </button>
    )
  },
)

IconButton.displayName = 'IconButton'
