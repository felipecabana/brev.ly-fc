import { cn } from '../lib/utils'

interface LogoProps {
  className?: string
  variant?: 'full' | 'icon'
}

export function Logo({ className, variant = 'full' }: LogoProps) {
  if (variant === 'icon') {
    return (
      <img
        src="/assets/logo-icon.svg"
        alt="brev.ly"
        className={cn('size-[52px]', className)}
      />
    )
  }

  return (
    <span
      className={cn('inline-flex items-center gap-2', className)}
      aria-label="brev.ly"
    >
      <img
        src="/assets/logo-icon.svg"
        alt=""
        aria-hidden
        className="h-[23px] w-[27px] shrink-0"
      />
      <span className="font-logo text-[19px] font-bold leading-none text-blue-base">
        brev.ly
      </span>
    </span>
  )
}
