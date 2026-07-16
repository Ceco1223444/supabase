const CATEGORY_COLORS: Record<string, string> = {
  Reclamation: 'bg-cat-1/12 text-cat-1-text',
  Shipping: 'bg-cat-2/12 text-cat-2-text',
  Technical: 'bg-cat-3/12 text-cat-3-text',
  Inventory: 'bg-cat-4/12 text-cat-4-text',
  Pricing: 'bg-cat-5/12 text-cat-5-text',
  Urgent: 'bg-cat-6/12 text-cat-6-text',
  Other: 'bg-cat-7/12 text-cat-7-text',
}

export function CategoryBadge({ label }: { label: string | null }) {
  if (!label) return null
  const colorClass = CATEGORY_COLORS[label] ?? 'bg-ink-muted/12 text-ink-secondary'
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${colorClass}`}>
      {label}
    </span>
  )
}
