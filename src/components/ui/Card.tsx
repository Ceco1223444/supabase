import type { HTMLAttributes } from 'react'

export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl bg-surface p-6 shadow-card ${className}`}
      {...props}
    />
  )
}
