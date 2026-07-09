import { useAuth } from '@/auth/useAuth'
import { Button } from '@/components/ui/Button'

export function Topbar() {
  const { user, signOut } = useAuth()
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-surface px-6">
      <span className="text-sm text-ink-muted">{user?.email}</span>
      <Button variant="ghost" onClick={() => signOut()}>
        Log out
      </Button>
    </header>
  )
}
