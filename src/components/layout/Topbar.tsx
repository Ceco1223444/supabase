import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { useAuth } from '@/auth/useAuth'
import { Button } from '@/components/ui/Button'
import { AskAnseraPanel } from '@/components/askAnsera/AskAnseraPanel'
import { LoginDialog } from '@/components/auth/LoginDialog'
import { Wordmark } from './Wordmark'
import { ModuleSwitcher } from './ModuleSwitcher'

export function Topbar() {
  const { session, user, signOut } = useAuth()
  const [askOpen, setAskOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)

  return (
    <header className="shrink-0 border-b border-border-light bg-surface">
      <div className="flex h-20 items-center justify-between gap-6 px-8">
        <Link
          to="/"
          aria-label="Ansera home"
          className="origin-left scale-[0.85] rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          <Wordmark />
        </Link>
        <div className="hidden md:block">
          <ModuleSwitcher />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setAskOpen(true)}
            className="ai-ring inline-flex items-center gap-2 rounded-lg bg-accent-tint px-3.5 py-2 text-sm font-medium text-accent transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            <Sparkles className="size-4" aria-hidden />
            Ask Ansera
          </button>
          {session ? (
            <>
              <span className="hidden text-sm text-ink-muted lg:inline">{user?.email}</span>
              <Button variant="ghost" onClick={() => signOut()}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setLoginOpen(true)}>
                Log in
              </Button>
              <Link
                to="/#waitlist"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white shadow-soft transition-all duration-150 ease-out hover:bg-accent-hover hover:shadow-card active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                Join Waitlist
              </Link>
            </>
          )}
        </div>
      </div>
      {/* On narrow viewports the switcher gets its own row below the topbar. */}
      <div className="flex justify-center border-t border-border-light px-4 pt-1 md:hidden">
        <ModuleSwitcher />
      </div>
      {askOpen && <AskAnseraPanel onClose={() => setAskOpen(false)} />}
      {loginOpen && !session && <LoginDialog mode="overlay" onClose={() => setLoginOpen(false)} />}
    </header>
  )
}
