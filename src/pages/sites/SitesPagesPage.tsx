import { Card } from '@/components/ui/Card'
import { PreviewBanner } from '@/components/preview/PreviewBanner'
import { ExampleDataCaption } from '@/components/preview/ExampleDataCaption'

const PAGES = [
  { name: 'Home', type: 'Landing', edited: '2 hours ago' },
  { name: 'Catalog', type: 'Collection', edited: '2 hours ago' },
  { name: 'Product page', type: 'Template', edited: '2 hours ago' },
  { name: 'About', type: 'Content', edited: '3 hours ago' },
  { name: 'FAQ', type: 'Content', edited: '3 hours ago' },
  { name: 'Checkout', type: 'System', edited: '3 hours ago' },
]

export function SitesPagesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PreviewBanner module="sites" />
      <Card>
        <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr] gap-x-4 border-b border-border-light pb-3">
          {['Page', 'Type', 'Status', 'Last edited'].map((heading) => (
            <p key={heading} className="text-xs font-medium text-ink-muted">
              {heading}
            </p>
          ))}
        </div>
        <div className="flex flex-col divide-y divide-border-light">
          {PAGES.map((page) => (
            <div key={page.name} className="grid grid-cols-[1.2fr_1fr_1fr_1fr] items-center gap-x-4 py-3.5">
              <p className="text-sm font-medium text-ink">{page.name}</p>
              <p className="text-sm text-ink-secondary">{page.type}</p>
              <p>
                <span className="rounded-full bg-accent-tint px-2.5 py-0.5 text-xs font-medium text-accent">
                  Generated
                </span>
              </p>
              <p className="text-sm text-ink-muted">{page.edited}</p>
            </div>
          ))}
        </div>
        <ExampleDataCaption />
      </Card>
    </div>
  )
}
