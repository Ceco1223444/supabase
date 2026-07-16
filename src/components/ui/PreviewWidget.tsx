/**
 * Tiny concrete product moment, e.g. `Draft ready · "Re: Order #4127…" ·
 * Auto-sent`. Shared between the landing module cards and the in-app
 * preview screens so the suite tells one story.
 */
export function PreviewWidget({ parts, live }: { parts: string[]; live: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-border-light bg-page px-3.5 py-2.5">
      <span className={`size-2 shrink-0 rounded-full ${live ? 'bg-accent' : 'bg-ink-muted'}`} aria-hidden />
      {parts.map((part, i) => (
        <span key={part} className="flex items-center gap-2 text-xs text-ink-secondary">
          {i > 0 && <span className="text-border" aria-hidden>·</span>}
          <span className={i === 0 ? 'font-medium text-ink' : undefined}>{part}</span>
        </span>
      ))}
    </div>
  )
}
