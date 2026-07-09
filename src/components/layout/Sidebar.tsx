import { NavLink } from 'react-router-dom'

const links = [
  { to: '/inbox', label: 'Inbox' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/recommendations', label: 'Recommendations' },
  { to: '/knowledge-base', label: 'Knowledge Base' },
  { to: '/settings', label: 'Settings' },
]

export function Sidebar() {
  return (
    <nav className="flex w-56 shrink-0 flex-col gap-1 border-r border-border bg-surface p-4">
      <div className="mb-4 px-2 text-sm font-semibold text-ink">Customer Support</div>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-accent/15 text-accent'
                : 'text-ink-secondary hover:bg-surface-hover hover:text-ink'
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  )
}
