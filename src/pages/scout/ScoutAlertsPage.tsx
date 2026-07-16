import { Card } from '@/components/ui/Card'
import { Switch } from '@/components/ui/Switch'
import { PreviewBanner } from '@/components/preview/PreviewBanner'

const ALERTS = [
  {
    title: 'Rising interest',
    description: 'Alert me when search interest rises more than 200% in a week.',
    on: true,
  },
  {
    title: 'Saturation shift',
    description: 'Alert me when a tracked product’s ad saturation moves from low to medium.',
    on: true,
  },
  {
    title: 'Weekly digest',
    description: 'Send a weekly digest of new rising products every Monday.',
    on: false,
  },
]

export function ScoutAlertsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PreviewBanner module="scout" />
      <div className="flex flex-col gap-4">
        {ALERTS.map((alert) => (
          <Card key={alert.title}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-ink">{alert.title}</p>
                <p className="text-xs text-ink-muted">{alert.description}</p>
              </div>
              <Switch checked={alert.on} disabled onChange={() => {}} />
            </div>
          </Card>
        ))}
      </div>
      <p className="text-xs text-ink-muted">Available at launch</p>
    </div>
  )
}
