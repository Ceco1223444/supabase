import { useLayoutEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  Bell,
  BookOpen,
  CalendarDays,
  Eye,
  FileText,
  Film,
  Inbox,
  Lightbulb,
  LineChart,
  Link2,
  Palette,
  Settings,
  Store,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import { moduleFromPathname, type ModuleId } from '@/lib/modules'

type Tab = { to: string; label: string; Icon: LucideIcon; end?: boolean }

// One tab set per suite module. Index tabs (`/sites`, `/scout`, `/studio`)
// need `end` so they don't stay active on their sibling routes. Home has no
// tab row — it carries its own in-page anchor nav instead.
const MODULE_TABS: Record<ModuleId, Tab[]> = {
  home: [],
  inbox: [
    { to: '/inbox', label: 'Inbox', Icon: Inbox },
    { to: '/analytics', label: 'Analytics', Icon: LineChart },
    { to: '/recommendations', label: 'Recommendations', Icon: Lightbulb },
    { to: '/knowledge-base', label: 'Knowledge Base', Icon: BookOpen },
    { to: '/settings', label: 'Settings', Icon: Settings },
  ],
  sites: [
    { to: '/sites', label: 'Storefront', Icon: Store, end: true },
    { to: '/sites/pages', label: 'Pages', Icon: FileText },
    { to: '/sites/design', label: 'Design', Icon: Palette },
    { to: '/sites/settings', label: 'Settings', Icon: Settings },
  ],
  scout: [
    { to: '/scout', label: 'Trending', Icon: TrendingUp, end: true },
    { to: '/scout/watchlist', label: 'Watchlist', Icon: Eye },
    { to: '/scout/alerts', label: 'Alerts', Icon: Bell },
  ],
  studio: [
    { to: '/studio', label: 'Calendar', Icon: CalendarDays, end: true },
    { to: '/studio/library', label: 'Library', Icon: Film },
    { to: '/studio/channels', label: 'Channels', Icon: Link2 },
  ],
}

// Inset so the underline reads as a short editorial rule under the label
// rather than a full-width box edge.
const UNDERLINE_INSET_PX = 14

export function TabNav() {
  const { pathname } = useLocation()
  const tabs = MODULE_TABS[moduleFromPathname(pathname)]
  const navRef = useRef<HTMLElement>(null)
  // Measured from the active NavLink so the single .tab-underline element can
  // slide (left/width transition) to the new tab on switch instead of jumping.
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

  if (tabs.length === 0) return null

  return (
    <nav
      ref={navRef}
      aria-label="Main"
      className="relative flex flex-wrap items-center gap-1 bg-page px-8 py-3"
    >
      {tabs.map(({ to, label, Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-page ${
              isActive
                ? 'font-medium text-accent'
                : 'text-ink-secondary hover:bg-surface-hover hover:text-ink'
            }`
          }
        >
          <Icon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          {label}
        </NavLink>
      ))}
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
