import { type InputHTMLAttributes, forwardRef, useId } from 'react'
import { WarningIcon } from '@phosphor-icons/react'
import { cn } from '../../lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id: idProp, ...props }, ref) => {
    const generatedId = useId()
    const id = idProp ?? generatedId
    const hasError = Boolean(error)

    return (
      <div
        className={cn(
          'group flex w-full flex-col gap-2',
          hasError && 'has-error',
        )}
      >
        <label
          htmlFor={id}
          className={cn(
            'text-body-xs uppercase leading-[14px] text-gray-500',
            'group-focus-within:font-bold group-focus-within:text-blue-base',
            hasError && 'font-bold text-danger',
          )}
        >
          {label}
        </label>
        <input
          ref={ref}
          id={id}
          className={cn(
            'h-12 w-full rounded-md border px-4 text-body-md font-normal text-gray-600 outline-none transition-colors duration-200 ease-in-out',
            'placeholder:text-gray-400',
            hasError
              ? 'border-[1.5px] border-danger'
              : 'border border-gray-300 focus-visible:border-[1.5px] focus-visible:border-blue-base',
            className,
          )}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : undefined}
          {...props}
        />
        {hasError && (
          <div id={`${id}-error`} className="flex items-center gap-2" role="alert">
            <WarningIcon size={16} className="shrink-0 text-danger" aria-hidden />
            <span className="text-body-sm text-gray-500">{error}</span>
          </div>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
