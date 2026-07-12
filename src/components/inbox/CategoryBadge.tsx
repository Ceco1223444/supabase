const CATEGORY_COLORS: Record<string, string> = {
  Reclamation: 'bg-cat-1/15 text-cat-1-text',
  Shipping: 'bg-cat-2/15 text-cat-2-text',
  Technical: 'bg-cat-3/15 text-cat-3-text',
  Inventory: 'bg-cat-4/15 text-cat-4-text',
  Pricing: 'bg-cat-5/15 text-cat-5-text',
  Urgent: 'bg-cat-6/15 text-cat-6-text',
  Other: 'bg-cat-7/15 text-cat-7-text',
}

export function CategoryBadge({ label }: { label: string | null }) {
  if (!label) return null
  const colorClass = CATEGORY_COLORS[label] ?? 'bg-ink-muted/15 text-ink-muted'
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${colorClass}`}
    >
      {label}
    </span>
  )
}
