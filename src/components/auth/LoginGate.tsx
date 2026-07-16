import { Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/auth/useAuth'
import { LoginDialog } from './LoginDialog'
import { GlassAnalyticsMock, GlassInboxMock, GlassRowsMock } from './GlassMocks'

/**
 * Wraps the Inbox-module routes. Logged in: renders the real tab untouched.
 * Logged out: renders a blurred, inert glass mock of the tab shape with the
 * login dialog centered on top. Real components never mount while gated, so
 * no data queries fire and nothing behind the blur is reachable.
 */
export function LoginGate() {
  const { session, loading } = useAuth()
  const { pathname } = useLocation()

  // Session restore in flight — render nothing gate-like to avoid flashing
  // the dialog at a logged-in user on refresh.
  if (loading) {
    return <p className="text-sm text-ink-muted">Loading…</p>
  }

  if (session) return <Outlet />

  const section = pathname.split('/')[1]
  const Mock =
    section === 'inbox' ? GlassInboxMock : section === 'analytics' ? GlassAnalyticsMock : GlassRowsMock

  return (
    <div className="relative min-h-[70svh]">
      <div inert aria-hidden className="pointer-events-none select-none">
        <Mock />
      </div>
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-page/60 p-4 backdrop-blur-sm animate-[fade-in_150ms_ease-out]">
        <LoginDialog mode="gate" />
      </div>
    </div>
  )
}
