import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '../../lib/utils'

type CardVariant = 'panel' | 'centered'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'panel', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-md bg-gray-100',
          variant === 'panel' && 'flex w-full flex-col p-6 lg:p-8',
          variant === 'centered' &&
            'flex w-full max-w-[580px] flex-col items-center gap-6 px-5 py-12 md:px-12 md:py-16',
          className,
        )}
        {...props}
      />
    )
  },
)

Card.displayName = 'Card'
