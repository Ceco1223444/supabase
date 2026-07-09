import { useEffect, useState } from 'react'
import { CategoryBadge } from './CategoryBadge'
import { StatusBadge } from './StatusBadge'
import { ApproveSendButton } from './ApproveSendButton'
import { Card } from '@/components/ui/Card'
import type { Database } from '@/lib/database.types'

type EmailLog = Database['public']['Tables']['email_logs']['Row']

export function ThreadDetail({ email }: { email: EmailLog }) {
  const [draft, setDraft] = useState(email.final_response ?? email.ai_response ?? '')

  useEffect(() => {
    setDraft(email.final_response ?? email.ai_response ?? '')
  }, [email.id, email.final_response, email.ai_response])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <CategoryBadge label={email.label} />
        <StatusBadge status={email.status} />
      </div>
      <h1 className="text-lg font-semibold text-ink">{email.subject}</h1>
      <p className="text-sm text-ink-muted">From {email.sender_email}</p>

      <Card>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Incoming Message
        </p>
        <p className="whitespace-pre-wrap text-sm text-ink-secondary">{email.incoming_message}</p>
      </Card>

      <Card>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
          AI Response
        </p>
        {email.status === 'pending_review' ? (
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={10}
            className="w-full rounded-md border border-border bg-page p-3 text-sm text-ink outline-none focus:border-accent"
          />
        ) : (
          <p className="whitespace-pre-wrap text-sm text-ink-secondary">
            {email.final_response ?? email.ai_response}
          </p>
        )}
      </Card>

      {email.status === 'pending_review' && (
        <ApproveSendButton emailLogId={email.id} finalResponse={draft} />
      )}
    </div>
  )
}
