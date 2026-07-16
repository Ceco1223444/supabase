import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Check } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

const MODULE_OPTIONS = [
  { value: 'sites', label: 'Sites' },
  { value: 'scout', label: 'Scout' },
  { value: 'studio', label: 'Studio' },
  { value: 'all', label: 'All of them' },
] as const

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  module_interest: z.enum(['sites', 'scout', 'studio', 'all']),
  current_products: z.string().max(280, 'Keep it under 280 characters').optional(),
})
type FormValues = z.infer<typeof schema>

export function WaitlistForm() {
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { module_interest: 'all' },
  })

  async function onSubmit(values: FormValues) {
    setServerError(null)
    const trimmedProducts = values.current_products?.trim()
    // No .select() after the insert — the table is write-only for the anon
    // role, so asking the row back would be rejected by design.
    const { error } = await supabase.from('waitlist_signups').insert({
      email: values.email,
      module_interest: values.module_interest,
      current_products: trimmedProducts ? trimmedProducts : null,
    })
    if (error) {
      setServerError('Something went wrong on our side — please try again.')
      return
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <Card className="mx-auto w-full max-w-lg text-center animate-[scale-in_200ms_ease-out]">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-accent-tint">
          <Check className="size-6 text-accent" aria-hidden />
        </div>
        <p className="text-base font-medium text-ink">
          You're on the list — we'll email you the moment your selected module opens up.
        </p>
      </Card>
    )
  }

  return (
    <Card className="mx-auto w-full max-w-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <div>
          <label htmlFor="waitlist-email" className="mb-1.5 block text-sm font-medium text-ink">
            Email
          </label>
          <Input
            id="waitlist-email"
            type="email"
            placeholder="you@yourstore.com"
            {...register('email')}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-cat-6-text animate-[fade-in_150ms_ease-out]">
              {errors.email.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="waitlist-module" className="mb-1.5 block text-sm font-medium text-ink">
            Which module are you most excited for?
          </label>
          <select
            id="waitlist-module"
            className="w-full rounded-lg border border-border bg-page px-3 py-2 text-sm text-ink outline-none transition-colors duration-150 focus:border-accent focus:ring-2 focus:ring-accent/20"
            {...register('module_interest')}
          >
            {MODULE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="waitlist-products" className="mb-1.5 block text-sm font-medium text-ink">
            What do you currently sell, if anything?{' '}
            <span className="font-normal text-ink-muted">(optional)</span>
          </label>
          <Input
            id="waitlist-products"
            type="text"
            placeholder="e.g. handmade ceramics, print-on-demand apparel"
            {...register('current_products')}
          />
          {errors.current_products && (
            <p className="mt-1 text-xs text-cat-6-text animate-[fade-in_150ms_ease-out]">
              {errors.current_products.message}
            </p>
          )}
        </div>
        {serverError && (
          <p className="text-sm text-cat-6-text animate-[fade-in_150ms_ease-out]">{serverError}</p>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Joining…' : 'Join Waitlist'}
        </Button>
      </form>
    </Card>
  )
}
