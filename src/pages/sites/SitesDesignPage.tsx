import { Card } from '@/components/ui/Card'
import { Switch } from '@/components/ui/Switch'
import { Button } from '@/components/ui/Button'
import { PreviewBanner } from '@/components/preview/PreviewBanner'

// Swatch stacks stay inside the app's own neutral tokens — themes differ by
// value, not by hue, so the single-accent rule holds.
const THEMES = [
  { name: 'Porcelain', swatches: ['#ffffff', '#f7f5f0', '#e7e3d8'] },
  { name: 'Sandstone', swatches: ['#f7f5f0', '#f3f0e9', '#8b8578'] },
  { name: 'Graphite', swatches: ['#5a564c', '#201e19', '#f7f5f0'] },
]

const FONT_PAIRS = [
  { display: 'Serif display', body: 'Sans body', displayClass: 'font-serif' },
  { display: 'Sans display', body: 'Sans body', displayClass: 'font-sans' },
]

export function SitesDesignPage() {
  return (
    <div className="flex flex-col gap-6">
      <PreviewBanner module="sites" />
      <div>
        <h2 className="mb-3 text-sm font-semibold text-ink">Theme</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {THEMES.map((theme) => (
            <Card key={theme.name} className="flex flex-col gap-4">
              <div className="flex gap-2">
                {theme.swatches.map((swatch) => (
                  <span
                    key={swatch}
                    className="h-10 flex-1 rounded-lg border border-border-light"
                    style={{ background: swatch }}
                    aria-hidden
                  />
                ))}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-ink">{theme.name}</p>
                <Button variant="secondary" disabled>
                  Use theme
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <div>
        <h2 className="mb-3 text-sm font-semibold text-ink">Type</h2>
        <Card className="flex flex-col divide-y divide-border-light py-2">
          {FONT_PAIRS.map((pair) => (
            <div key={pair.display} className="flex items-center gap-4 py-4">
              <span className={`text-2xl text-ink ${pair.displayClass}`} aria-hidden>
                Aa
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-ink">{pair.display}</p>
                <p className="text-xs text-ink-muted">{pair.body}</p>
              </div>
              <Button variant="secondary" disabled>
                Use pair
              </Button>
            </div>
          ))}
        </Card>
      </div>
      <div>
        <h2 className="mb-3 text-sm font-semibold text-ink">Layout</h2>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-ink">Spacing</p>
              <p className="text-xs text-ink-muted">Comfortable now, compact when you need density.</p>
            </div>
            <Switch checked={false} disabled onChange={() => {}} />
          </div>
        </Card>
      </div>
      <p className="text-xs text-ink-muted">Available at launch</p>
    </div>
  )
}
