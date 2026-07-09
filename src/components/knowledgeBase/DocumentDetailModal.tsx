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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[80svh] w-full max-w-2xl overflow-y-auto rounded-lg border border-border bg-surface p-6"
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
