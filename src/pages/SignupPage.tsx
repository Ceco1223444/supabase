import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/auth/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
type FormValues = z.infer<typeof schema>

export function SignupPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormValues) {
    setServerError(null)
    const { error } = await signUp(values.email, values.password)
    if (error) {
      setServerError(error)
      return
    }
    setDone(true)
    setTimeout(() => navigate('/inbox', { replace: true }), 800)
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-page px-4">
      <Card className="w-full max-w-sm">
        <h1 className="mb-1 text-xl font-semibold text-ink">Sign up</h1>
        <p className="mb-6 text-sm text-ink-muted">Create your business account</p>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <Input type="email" placeholder="Email" {...register('email')} />
            {errors.email && (
              <p className="mt-1 text-xs text-cat-6-text animate-[fade-in_150ms_ease-out]">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <Input type="password" placeholder="Password" {...register('password')} />
            {errors.password && (
              <p className="mt-1 text-xs text-cat-6-text animate-[fade-in_150ms_ease-out]">
                {errors.password.message}
              </p>
            )}
          </div>
          {serverError && (
            <p className="text-sm text-cat-6-text animate-[fade-in_150ms_ease-out]">{serverError}</p>
          )}
          {done && (
            <p className="text-sm text-cat-2-text animate-[fade-in_150ms_ease-out]">
              Account created — redirecting…
            </p>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account…' : 'Sign up'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-ink-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:underline">
            Log in
          </Link>
        </p>
      </Card>
    </div>
  )
}
