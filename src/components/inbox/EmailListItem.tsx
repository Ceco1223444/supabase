import { Link } from 'react-router-dom'
import { StatusBadge } from './StatusBadge'
import type { Database } from '@/lib/database.types'

type EmailLog = Database['public']['Tables']['email_logs']['Row']

export function EmailListItem({ email }: { email: EmailLog }) {
  // One-line preview of the AI draft — the queue answers "what is Ansera about
  // to say?" at a glance, without opening the thread.
  const snippet = (email.final_response ?? email.ai_response)?.replace(/\s+/g, ' ').trim()

  return (
    <Link
      to={`/inbox/${email.id}`}
      className="block rounded-xl bg-surface p-4 shadow-card transition-shadow duration-200 ease-out hover:shadow-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-page"
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className="truncate text-sm font-medium text-ink">{email.sender_email}</span>
        <span className="shrink-0 text-xs text-ink-muted">
          {email.created_at ? new Date(email.created_at).toLocaleDateString() : ''}
        </span>
      </div>
      <p className="mt-1 truncate text-sm text-ink-secondary">{email.subject}</p>
      {snippet && <p className="mt-1.5 truncate text-xs text-ink-muted">{snippet}</p>}
      <div className="mt-3">
        <StatusBadge status={email.status} />
      </div>
    </Link>
  )
}
