import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Lock } from 'lucide-react'
import { useAuth } from '@/auth/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
type FormValues = z.infer<typeof schema>

type Props =
  | { mode: 'gate' }
  | { mode: 'overlay'; onClose: () => void }

/**
 * The inline login form, mounted two ways: inside the login gate (over a
 * blurred glass mock — no close affordance, "Back to overview" instead), or
 * as a standalone overlay from the topbar's Log in button. On success the
 * auth state change unmounts the gate in place; no navigation happens.
 */
export function LoginDialog(props: Props) {
  const { signIn } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormValues) {
    setServerError(null)
    const { error } = await signIn(values.email, values.password)
    if (error) {
      setServerError(error)
      return
    }
    if (props.mode === 'overlay') props.onClose()
  }

  const card = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={props.mode === 'gate' ? 'Log in to access Ansera Inbox' : 'Log in'}
      className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-raised animate-[scale-in_180ms_ease-out]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-accent-tint">
        <Lock className="size-5 text-accent" aria-hidden />
      </div>
      <h2 className="text-center text-lg font-semibold text-ink">
        {props.mode === 'gate' ? 'Log in to access Ansera Inbox' : 'Log in'}
      </h2>
      {props.mode === 'gate' && (
        <p className="mt-1 text-center text-sm text-ink-secondary">
          Your inbox, analytics, and settings live in your account.
        </p>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4" noValidate>
        <div>
          <Input type="email" placeholder="Email" autoComplete="email" {...register('email')} />
          {errors.email && (
            <p className="mt-1 text-xs text-cat-6-text animate-[fade-in_150ms_ease-out]">
              {errors.email.message}
            </p>
          )}
        </div>
        <div>
          <Input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            {...register('password')}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-cat-6-text animate-[fade-in_150ms_ease-out]">
              {errors.password.message}
            </p>
          )}
        </div>
        {serverError && (
          <p className="text-sm text-cat-6-text animate-[fade-in_150ms_ease-out]">{serverError}</p>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in…' : 'Log in'}
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-ink-muted">
        No account?{' '}
        <Link to="/signup" className="text-accent hover:underline">
          Sign up
        </Link>
      </p>
      {props.mode === 'gate' && (
        <p className="mt-2 text-center text-sm">
          <Link to="/" className="text-ink-muted underline-offset-2 hover:text-ink hover:underline">
            Back to overview
          </Link>
        </p>
      )}
    </div>
  )

  if (props.mode === 'gate') return card

  return <OverlayShell onClose={props.onClose}>{card}</OverlayShell>
}

function OverlayShell({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-page/60 p-4 backdrop-blur-sm animate-[fade-in_150ms_ease-out]"
      onClick={onClose}
    >
      {children}
    </div>
  )
}
