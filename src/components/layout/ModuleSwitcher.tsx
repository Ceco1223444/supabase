import { useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SUITE_MODULES, moduleFromPathname } from '@/lib/modules'
import { StatusPill } from '@/components/ui/StatusPill'

// Same short-rule inset as TabNav, so the two underlines read as one system.
const UNDERLINE_INSET_PX = 12

/** Suite-level segmented control: Home · Inbox (Live) · Sites · Scout · Studio. */
export function ModuleSwitcher() {
  const { pathname } = useLocation()
  const activeModule = moduleFromPathname(pathname)
  const navRef = useRef<HTMLElement>(null)
  const [underline, setUnderline] = useState<{ left: number; width: number } | null>(null)

  useLayoutEffect(() => {
    const nav = navRef.current
    if (!nav) return
    const measure = () => {
      const active = nav.querySelector<HTMLElement>('a[aria-current="page"]')
      setUnderline(active ? { left: active.offsetLeft, width: active.offsetWidth } : null)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [pathname])

  return (
    <nav ref={navRef} aria-label="Modules" className="relative flex items-center gap-1 pb-1.5">
      {SUITE_MODULES.map((module) => {
        const isActive = module.id === activeModule
        return (
          <Link
            key={module.id}
            to={module.to}
            aria-current={isActive ? 'page' : undefined}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
              isActive ? 'font-medium text-accent' : 'text-ink-secondary hover:bg-surface-hover hover:text-ink'
            }`}
          >
            {module.label}
            {module.pill && (
              <StatusPill tone={module.pill === 'live' ? 'live' : 'muted'} size="xs">
                {module.pill === 'live' ? 'Live' : 'Preview'}
              </StatusPill>
            )}
          </Link>
        )
      })}
      <span
        aria-hidden="true"
        className="tab-underline"
        style={
          underline
            ? {
                left: underline.left + UNDERLINE_INSET_PX,
                width: Math.max(underline.width - UNDERLINE_INSET_PX * 2, 0),
                opacity: 1,
              }
            : { opacity: 0 }
        }
      />
    </nav>
  )
}
