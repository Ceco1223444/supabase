import { useState } from 'react'
import { useCreatePolicyRequest, usePolicyRequests } from '@/hooks/usePolicyRequests'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export function PolicyRequestForm() {
  const [details, setDetails] = useState('')
  const { data: requests } = usePolicyRequests()
  const createRequest = useCreatePolicyRequest()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!details.trim()) return
    createRequest.mutate(details, { onSuccess: () => setDetails('') })
  }

  return (
    <Card>
      <p className="mb-3 text-sm font-medium text-ink">Request a policy update</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={3}
          placeholder="Describe the FAQ/policy change you'd like…"
          className="w-full rounded-md border border-border bg-page p-3 text-sm text-ink placeholder:text-ink-muted outline-none focus:border-accent"
        />
        <Button type="submit" disabled={createRequest.isPending} className="self-start">
          {createRequest.isPending ? 'Submitting…' : 'Submit request'}
        </Button>
      </form>
      {requests && requests.length > 0 && (
        <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
          {requests.map((r) => (
            <div key={r.id} className="text-xs text-ink-muted">
              <span className="font-medium text-ink-secondary">{r.status}</span> — {r.request_details}
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
