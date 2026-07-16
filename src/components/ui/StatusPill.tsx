import type { ReactNode } from 'react'

/**
 * Module status pill, shared between the landing page (Live / Coming soon)
 * and the app's module switcher (Live / Preview). The live tone is the only
 * one that carries the accent; everything else stays muted.
 */
export function StatusPill({
  tone,
  size = 'sm',
  children,
}: {
  tone: 'live' | 'muted'
  size?: 'xs' | 'sm'
  children: ReactNode
}) {
  const sizing = size === 'xs' ? 'px-2 py-px text-[10px]' : 'px-2.5 py-0.5 text-xs'
  if (tone === 'live') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full bg-accent-tint font-medium text-accent ${sizing}`}
      >
        <span className="size-1.5 rounded-full bg-accent" aria-hidden />
        {children}
      </span>
    )
  }
  return (
    <span className={`rounded-full bg-surface-hover font-medium text-ink-muted ${sizing}`}>
      {children}
    </span>
  )
}
