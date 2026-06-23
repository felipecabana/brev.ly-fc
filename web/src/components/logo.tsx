import { cn } from '../lib/utils'

interface LogoProps {
  className?: string
  variant?: 'full' | 'icon'
}

export function Logo({ className, variant = 'full' }: LogoProps) {
  const src = variant === 'icon' ? '/assets/logo-icon.svg' : '/assets/logo.svg'

  return (
    <img
      src={src}
      alt="brev.ly"
      className={cn(variant === 'full' ? 'h-6 w-auto' : 'size-[52px]', className)}
    />
  )
}
