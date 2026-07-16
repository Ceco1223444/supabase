import { Button } from '@/components/ui/Button'

/** A launch-only control: visibly disabled, honestly captioned. */
export function DisabledAction({ label, className = '' }: { label: string; className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Button disabled>{label}</Button>
      <span className="text-xs text-ink-muted">Available at launch</span>
    </div>
  )
}
