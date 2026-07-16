// "Bank balance" treatment: one large confident figure, small muted label
// beneath it. Proportional figures (no tabular-nums) — big standalone numbers
// read better with natural digit widths.
export function StatTile({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl bg-surface p-6 shadow-card">
      <p className="text-4xl font-semibold tracking-tight text-ink">{value}</p>
      <p className="mt-2 text-sm text-ink-muted">{label}</p>
    </div>
  )
}
