import { forwardRef, type InputHTMLAttributes } from 'react'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className = '', ...props }, ref) {
    return (
      <input
        ref={ref}
        className={`w-full rounded-lg border border-border bg-page px-3 py-2 text-sm text-ink placeholder:text-ink-muted outline-none transition-colors duration-150 focus:border-accent focus:ring-2 focus:ring-accent/20 ${className}`}
        {...props}
      />
    )
  },
)
