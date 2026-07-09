import { Link } from 'react-router-dom'
import { CategoryBadge } from './CategoryBadge'
import { StatusBadge } from './StatusBadge'
import type { Database } from '@/lib/database.types'

type EmailLog = Database['public']['Tables']['email_logs']['Row']

export function EmailListItem({ email }: { email: EmailLog }) {
  return (
    <Link
      to={`/inbox/${email.id}`}
      className="block rounded-md border border-transparent p-3 hover:border-border hover:bg-surface-hover"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-sm font-medium text-ink">{email.sender_email}</span>
        <span className="shrink-0 text-xs text-ink-muted">
          {email.created_at ? new Date(email.created_at).toLocaleDateString() : ''}
        </span>
      </div>
      <p className="mt-1 truncate text-sm text-ink-secondary">{email.subject}</p>
      <div className="mt-2 flex gap-2">
        <CategoryBadge label={email.label} />
        <StatusBadge status={email.status} />
      </div>
    </Link>
  )
}
