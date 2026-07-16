// Quiet pills: soft ~12% tints with darkened text — informational, never
// alarming, even for "Escalated".
const STATUS_STYLES: Record<string, string> = {
  pending_review: 'bg-cat-3/12 text-cat-3-text',
  auto_sent: 'bg-cat-2/12 text-cat-2-text',
  sent: 'bg-cat-1/12 text-cat-1-text',
  escalated: 'bg-cat-6/12 text-cat-6-text',
}

const STATUS_LABELS: Record<string, string> = {
  pending_review: 'Needs review',
  auto_sent: 'Auto-sent',
  sent: 'Sent',
  escalated: 'Escalated',
}

export function StatusBadge({ status }: { status: string | null }) {
  if (!status) return null
  const colorClass = STATUS_STYLES[status] ?? 'bg-ink-muted/12 text-ink-secondary'
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${colorClass}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}
