import { Check } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { PreviewWidget } from '@/components/ui/PreviewWidget'
import { PreviewBanner } from '@/components/preview/PreviewBanner'
import { DisabledAction } from '@/components/preview/DisabledAction'
import { ExampleDataCaption } from '@/components/preview/ExampleDataCaption'

const EXAMPLE_PROMPTS = [
  'Handmade ceramics studio',
  'Pet accessories, 30 SKUs',
  'Single-product gadget store',
]

const PAGES_BUILT = ['Home', 'Catalog', 'Product page', 'About', 'FAQ', 'Checkout']

/** Flat storefront mock in a browser frame — same vocabulary as the landing scenes. */
function StorefrontPreview() {
  return (
    <div className="overflow-hidden rounded-xl border border-border-light bg-white shadow-soft">
      {/* browser chrome */}
      <div className="flex items-center gap-2 border-b border-border-light bg-page px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-border" aria-hidden />
        <span className="size-2.5 rounded-full bg-border" aria-hidden />
        <span className="size-2.5 rounded-full bg-border" aria-hidden />
        <span className="ml-3 h-5 flex-1 rounded-full border border-border-light bg-white" aria-hidden />
      </div>
      {/* storefront: nav */}
      <div className="flex items-center justify-between px-6 py-4">
        <span className="h-2.5 w-16 rounded-full bg-[#ccd7e8]" aria-hidden />
        <span className="flex gap-3" aria-hidden>
          <span className="h-2 w-8 rounded-full bg-[#e3e1d8]" />
          <span className="h-2 w-8 rounded-full bg-[#e3e1d8]" />
          <span className="h-2 w-8 rounded-full bg-[#e3e1d8]" />
        </span>
      </div>
      {/* storefront: hero */}
      <div className="mx-6 flex flex-col items-center gap-2.5 rounded-lg bg-[#f4f7fd] py-8" aria-hidden>
        <span className="h-3 w-40 rounded-full bg-[#aecbfa]" />
        <span className="h-2 w-56 rounded-full bg-[#dce9fc]" />
        <span className="mt-2 h-6 w-24 rounded-full bg-[#1a73e8] opacity-80" />
      </div>
      {/* storefront: product grid */}
      <div className="grid grid-cols-4 gap-3 px-6 py-6" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center gap-2 rounded-lg bg-[#f7f6f2] p-3">
            <span
              className={`bg-[#ccd7e8] ${i % 2 === 0 ? 'size-9 rounded-full' : 'h-9 w-6 rounded-md'}`}
            />
            <span className="h-1.5 w-12 rounded-full bg-[#e3e1d8]" />
            <span className="h-1.5 w-7 rounded-full bg-[#cfe0f8]" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function SitesStorefrontPage() {
  return (
    <div className="flex flex-col gap-6">
      <PreviewBanner module="sites" />
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-ink">Describe your store.</h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-secondary">
            One sentence in, a complete storefront out — copy, layout, and product pages included.
          </p>
          <div className="mt-5">
            <Input type="text" placeholder="Minimalist skincare brand, 12 products" disabled />
          </div>
          <DisabledAction label="Generate storefront" className="mt-4" />
          <div className="mt-5 flex flex-wrap gap-2">
            {EXAMPLE_PROMPTS.map((prompt) => (
              <span
                key={prompt}
                className="rounded-full bg-surface-hover px-3 py-1.5 text-xs text-ink-muted"
              >
                {prompt}
              </span>
            ))}
          </div>
        </Card>
        <div className="flex flex-col gap-4">
          <StorefrontPreview />
          <PreviewWidget
            parts={['Generating storefront', '“Minimalist skincare brand, 12 products”', '6 pages built']}
            live={false}
          />
        </div>
      </div>
      <Card>
        <h2 className="text-sm font-semibold text-ink">Pages built</h2>
        <p className="mt-1 text-xs text-ink-muted">
          Every storefront ships complete — nothing left to wire up.
        </p>
        <div className="mt-4 flex flex-col divide-y divide-border-light">
          {PAGES_BUILT.map((page) => (
            <div key={page} className="flex items-center gap-3 py-3">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-tint">
                <Check className="size-3.5 text-accent" aria-hidden />
              </span>
              <span className="text-sm text-ink">{page}</span>
            </div>
          ))}
        </div>
        <ExampleDataCaption />
      </Card>
    </div>
  )
}
