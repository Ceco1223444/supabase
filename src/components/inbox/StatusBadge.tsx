const STATUS_STYLES: Record<string, string> = {
  pending_review: 'bg-cat-3/15 text-cat-3',
  auto_sent: 'bg-cat-2/15 text-cat-2',
  sent: 'bg-cat-2/15 text-cat-2',
}

const STATUS_LABELS: Record<string, string> = {
  pending_review: 'Pending Review',
  auto_sent: 'Auto-Sent',
  sent: 'Sent',
}

export function StatusBadge({ status }: { status: string | null }) {
  if (!status) return null
  const colorClass = STATUS_STYLES[status] ?? 'bg-ink-muted/15 text-ink-muted'
  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${colorClass}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}
