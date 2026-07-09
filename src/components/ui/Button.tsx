import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'

const variantClasses: Record<Variant, string> = {
  primary: 'bg-accent text-white hover:opacity-90',
  secondary: 'bg-surface-hover text-ink border border-border hover:bg-border',
  danger: 'bg-cat-6 text-white hover:opacity-90',
  ghost: 'text-ink-secondary hover:text-ink hover:bg-surface-hover',
}

export function Button({
  variant = 'primary',
  className = '',
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      {...props}
    />
  )
}
