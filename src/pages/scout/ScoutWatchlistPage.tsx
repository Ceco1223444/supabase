import { Eye } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { PreviewBanner } from '@/components/preview/PreviewBanner'
import { NotifyMeButton } from '@/components/preview/NotifyMeButton'

export function ScoutWatchlistPage() {
  return (
    <div className="flex flex-col gap-6">
      <PreviewBanner module="scout" />
      <Card className="flex flex-col items-center py-16 text-center">
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-surface-hover">
          <Eye className="size-6 text-ink-muted" aria-hidden />
        </div>
        <p className="max-w-md text-sm leading-relaxed text-ink-secondary">
          Nothing on your watchlist yet. Scout ships soon — join the waitlist and start tracking
          on day one.
        </p>
        <div className="mt-5">
          <NotifyMeButton module="scout" />
        </div>
      </Card>
    </div>
  )
}
