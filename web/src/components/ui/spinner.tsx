import { cn } from '../../lib/utils'

type SpinnerSize = 'sm' | 'md' | 'lg'

interface SpinnerProps {
  size?: SpinnerSize
  label?: string
  className?: string
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'size-4 border-2',
  md: 'size-6 border-2',
  lg: 'size-8 border-[3px]',
}

export function Spinner({
  size = 'md',
  label = 'Carregando',
  className,
}: SpinnerProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={label}
      className={cn(
        'animate-spin rounded-full border-gray-300 border-t-blue-base',
        sizeClasses[size],
        className,
      )}
    />
  )
}
