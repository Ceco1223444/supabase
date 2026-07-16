import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { ASK_EXAMPLES } from '@/lib/askAnseraExamples'
import { Card } from '@/components/ui/Card'

/**
 * The clickable prompt chips + example answer card, shared between the
 * landing page's Ask Ansera section and the in-app panel. `on` names the
 * background the showcase sits on, so inactive chips always contrast.
 */
export function AskAnseraShowcase({ on = 'surface' }: { on?: 'surface' | 'page' }) {
  const [askIndex, setAskIndex] = useState(0)
  const askActive = ASK_EXAMPLES[askIndex]
  const chipInactive =
    on === 'surface' ? 'bg-page text-ink-secondary shadow-soft' : 'bg-surface text-ink-secondary shadow-soft'
  const ringOffset = on === 'surface' ? 'focus-visible:ring-offset-surface' : 'focus-visible:ring-offset-page'

  return (
    <div>
      <div className="mb-8 flex flex-wrap justify-center gap-3" role="tablist" aria-label="Example questions">
        {ASK_EXAMPLES.map((example, i) => (
          <button
            key={example.prompt}
            type="button"
            role="tab"
            aria-selected={i === askIndex}
            onClick={() => setAskIndex(i)}
            className={`rounded-full px-4 py-2 text-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${ringOffset} ${
              i === askIndex ? 'bg-accent-tint font-medium text-accent' : `${chipInactive} hover:text-ink`
            }`}
          >
            {`“${example.prompt}”`}
          </button>
        ))}
      </div>
      <div key={askIndex} className="animate-[page-fade-in_180ms_ease-out]">
        <Card className="mx-auto max-w-2xl">
          <p className="text-sm text-ink-muted">
            Ask Ansera: <span className="text-ink">{`“${askActive.prompt}”`}</span>
          </p>
          <div className="mt-5 border-t border-border-light pt-5">
            <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-accent">
              <Sparkles className="size-3.5" aria-hidden />
              Ansera Intelligence
            </p>
            <p className="text-sm leading-relaxed text-ink">{askActive.intelligence}</p>
          </div>
          <div className="mt-5 rounded-xl bg-accent-tint/60 p-4">
            <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-accent">
              Suggested next step
            </p>
            <p className="text-sm leading-relaxed text-ink-secondary">{askActive.nextStep}</p>
          </div>
          <p className="mt-5 text-xs text-ink-muted">Sources: {askActive.sources}</p>
        </Card>
      </div>
    </div>
  )
}
