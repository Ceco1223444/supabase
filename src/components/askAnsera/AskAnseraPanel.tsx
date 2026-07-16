import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { AskAnseraShowcase } from './AskAnseraShowcase'

export function AskAnseraPanel({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-[fade-in_150ms_ease-out]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Ask Ansera"
        className="max-h-[85svh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-page p-6 shadow-raised animate-[scale-in_180ms_ease-out] sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-ink">Ask Ansera</h2>
            <p className="mt-1 text-sm text-ink-secondary">
              Signals across your support tickets, storefront traffic, product trends, and content
              performance — turned into clear next steps.
            </p>
          </div>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
        <AskAnseraShowcase on="page" />
        <p className="mt-6 text-center text-xs text-ink-muted">
          Ask Ansera goes live with the suite. The answers shown here are examples.
        </p>
      </div>
    </div>
  )
}
