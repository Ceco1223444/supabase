import { useAuth } from '@/auth/useAuth'
import { Button } from '@/components/ui/Button'
import { Wordmark } from './Wordmark'

export function Topbar() {
  const { user, signOut } = useAuth()
  return (
    <header className="grid h-16 shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b border-border bg-surface px-6">
      <div />
      <Wordmark />
      <div className="flex items-center justify-end gap-3">
        <span className="text-sm text-ink-muted">{user?.email}</span>
        <Button variant="ghost" onClick={() => signOut()}>
          Log out
        </Button>
      </div>
    </header>
  )
}
