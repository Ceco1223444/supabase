import { Button } from '@/components/ui/Button'

export function DocumentDetailModal({
  content,
  onClose,
}: {
  content: string
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-[fade-in_150ms_ease-out]"
      onClick={onClose}
    >
      <div
        className="max-h-[80svh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-surface p-6 shadow-raised animate-[scale-in_180ms_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink">Document chunk</h2>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
        <p className="whitespace-pre-wrap text-sm text-ink-secondary">{content}</p>
      </div>
    </div>
  )
}
