import { useState, type FormEvent } from 'react'
import { Check } from 'lucide-react'
import { useAuth } from '@/auth/useAuth'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { PreviewModuleId } from '@/lib/modules'

const EMAIL_RE = /^\S+@\S+\.\S+$/

/**
 * The one real action in a preview module: join the launch waitlist for it.
 * Signed in it's one click with the account email; signed out the button
 * expands inline into an email field. Both paths write to the same
 * waitlist_signups table (insert-only for this role — never `.select()`).
 */
export function NotifyMeButton({ module }: { module: PreviewModuleId }) {
  const { user } = useAuth()
  const [state, setState] = useState<'idle' | 'input' | 'saving' | 'done'>('idle')
  const [typedEmail, setTypedEmail] = useState('')
  const [fieldError, setFieldError] = useState<string | null>(null)

  async function insert(email: string) {
    setState('saving')
    const { error } = await supabase.from('waitlist_signups').insert({
      email,
      module_interest: module,
    })
    // A unique-violation just means they're already on the list — success.
    if (error && error.code !== '23505') {
      setFieldError('Something went wrong — try again.')
      setState(user?.email ? 'idle' : 'input')
      return
    }
    setState('done')
  }

  function onClick() {
    setFieldError(null)
    if (user?.email) {
      void insert(user.email)
    } else {
      setState('input')
    }
  }

  function onVisitorSubmit(e: FormEvent) {
    e.preventDefault()
    setFieldError(null)
    const email = typedEmail.trim()
    if (!EMAIL_RE.test(email)) {
      setFieldError('Enter a valid email')
      return
    }
    void insert(email)
  }

  if (state === 'done') {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-ink-muted animate-[fade-in_150ms_ease-out]">
        <Check className="size-4 text-accent" aria-hidden />
        You're on the list.
      </span>
    )
  }

  // Visitor mode: the button expanded into an inline email field.
  if (!user?.email && state !== 'idle') {
    return (
      <form
        onSubmit={onVisitorSubmit}
        className="flex flex-wrap items-center gap-2 animate-[fade-in_150ms_ease-out]"
        noValidate
      >
        <div>
          <Input
            type="email"
            autoFocus
            placeholder="you@yourstore.com"
            value={typedEmail}
            onChange={(e) => setTypedEmail(e.target.value)}
            className="w-52 bg-surface"
            aria-label="Email for the waitlist"
          />
        </div>
        <Button type="submit" variant="secondary" disabled={state === 'saving'}>
          {state === 'saving' ? 'Joining…' : 'Notify me'}
        </Button>
        {fieldError && (
          <span className="w-full text-xs text-cat-6-text animate-[fade-in_150ms_ease-out] sm:w-auto">
            {fieldError}
          </span>
        )}
      </form>
    )
  }

  return (
    <span className="inline-flex items-center gap-3">
      <Button variant="secondary" onClick={onClick} disabled={state === 'saving'}>
        {state === 'saving' ? 'Joining…' : 'Notify me'}
      </Button>
      {fieldError && (
        <span className="text-xs text-cat-6-text animate-[fade-in_150ms_ease-out]">{fieldError}</span>
      )}
    </span>
  )
}
