/**
 * Static stand-ins rendered behind the login gate's blur — the app "out of
 * focus". Gray and light-blue shapes only (existing tokens), no text, no
 * numbers, no components that fetch. Everything aria-hidden; the gate also
 * marks the whole layer inert.
 */

function Bar({ className = '' }: { className?: string }) {
  return <span className={`block rounded-full bg-border-light ${className}`} aria-hidden />
}

/** Inbox shape: search + thread list beside a thread detail pane. */
export function GlassInboxMock() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_2fr]" aria-hidden>
      <div className="flex flex-col gap-3">
        <div className="h-10 rounded-lg border border-border-light bg-surface" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl bg-surface p-4 shadow-soft">
            <span className={`size-2.5 shrink-0 rounded-full ${i < 2 ? 'bg-accent-tint' : 'bg-border-light'}`} />
            <div className="flex flex-1 flex-col gap-2">
              <Bar className={`h-2.5 ${i % 2 ? 'w-2/5' : 'w-1/2'}`} />
              <Bar className={`h-2 ${i % 3 ? 'w-4/5' : 'w-3/5'} opacity-70`} />
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl bg-surface p-6 shadow-card">
        <Bar className="h-3 w-1/3" />
        <div className="mt-6 flex flex-col gap-3">
          <Bar className="h-2.5 w-full" />
          <Bar className="h-2.5 w-11/12" />
          <Bar className="h-2.5 w-4/5" />
          <Bar className="h-2.5 w-2/3" />
        </div>
        <div className="mt-8 rounded-xl bg-accent-tint/50 p-4">
          <div className="flex flex-col gap-3">
            <Bar className="h-2.5 w-3/4 bg-accent-tint" />
            <Bar className="h-2.5 w-1/2 bg-accent-tint" />
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-3">
          <span className="h-9 w-24 rounded-lg bg-border-light" />
          <span className="h-9 w-28 rounded-lg bg-accent-tint" />
        </div>
      </div>
    </div>
  )
}

/** Analytics shape: stat tiles above a donut card and a line-chart card. */
export function GlassAnalyticsMock() {
  return (
    <div className="flex flex-col gap-6" aria-hidden>
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl bg-surface p-6 shadow-card">
            <Bar className={`h-8 ${i % 2 ? 'w-1/3' : 'w-2/5'} bg-surface-hover`} />
            <Bar className="mt-3 h-2.5 w-3/5" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="flex items-center justify-center rounded-2xl bg-surface p-10 shadow-card">
          <span className="size-40 rounded-full border-[22px] border-accent-tint" />
        </div>
        <div className="flex items-end gap-4 rounded-2xl bg-surface p-10 shadow-card">
          {[40, 64, 52, 88, 72, 108, 96].map((h, i) => (
            <span key={i} className="w-full rounded-t-md bg-accent-tint" style={{ height: h }} />
          ))}
        </div>
      </div>
    </div>
  )
}

/** Generic rows shape for Recommendations / Knowledge Base / Settings. */
export function GlassRowsMock() {
  return (
    <div className="flex flex-col gap-4" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="rounded-2xl bg-surface p-6 shadow-card">
          <Bar className={`h-3 ${i % 2 ? 'w-1/4' : 'w-1/3'}`} />
          <Bar className="mt-3 h-2.5 w-4/5 opacity-70" />
          <Bar className="mt-2 h-2.5 w-3/5 opacity-70" />
        </div>
      ))}
    </div>
  )
}
