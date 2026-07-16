import { Card } from '@/components/ui/Card'
import { PreviewBanner } from '@/components/preview/PreviewBanner'
import { DisabledAction } from '@/components/preview/DisabledAction'

const CHANNELS = [
  { name: 'TikTok', description: 'Short-form video, auto-posted on your schedule.' },
  { name: 'Instagram', description: 'Reels, published alongside every TikTok post.' },
]

export function StudioChannelsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PreviewBanner module="studio" />
      <div className="flex flex-col gap-4">
        {CHANNELS.map((channel) => (
          <Card key={channel.name}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-ink">{channel.name}</p>
                <p className="text-xs text-ink-muted">{channel.description}</p>
                <p className="mt-2 text-sm text-ink-muted">@yourstore</p>
              </div>
              <DisabledAction label="Connect" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
