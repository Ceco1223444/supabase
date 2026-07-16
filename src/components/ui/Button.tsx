import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'

const variantClasses: Record<Variant, string> = {
  primary: 'bg-accent text-white shadow-soft hover:bg-accent-hover hover:shadow-card',
  secondary:
    'bg-surface text-ink border border-border-light shadow-soft hover:bg-surface-hover hover:shadow-card',
  // bg-cat-6-text (not the raw bright bg-cat-6) so white button text clears WCAG AA (5.7:1 vs 3.9:1).
  danger: 'bg-cat-6-text text-white shadow-soft hover:opacity-90 hover:shadow-card',
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
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-page disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed disabled:shadow-none ${variantClasses[variant]} ${className}`}
      {...props}
    />
  )
}
