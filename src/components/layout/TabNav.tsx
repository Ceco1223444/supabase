import { NavLink } from 'react-router-dom'
import { Inbox, LineChart, Lightbulb, BookOpen, Settings } from 'lucide-react'

const tabs = [
  { to: '/inbox', label: 'Inbox', Icon: Inbox },
  { to: '/analytics', label: 'Analytics', Icon: LineChart },
  { to: '/recommendations', label: 'Recommendations', Icon: Lightbulb },
  { to: '/knowledge-base', label: 'Knowledge Base', Icon: BookOpen },
  { to: '/settings', label: 'Settings', Icon: Settings },
]

export function TabNav() {
  return (
    <nav
      aria-label="Main"
      className="flex flex-wrap items-center gap-2 border-b border-border bg-page px-6 py-3"
    >
      {tabs.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-page ${
              isActive
                ? 'border-transparent bg-accent-tint text-accent-hover shadow-sm shadow-accent/10'
                : 'border-border bg-surface text-ink-secondary hover:border-border-light hover:bg-surface-hover hover:shadow-sm'
            }`
          }
        >
          <Icon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
