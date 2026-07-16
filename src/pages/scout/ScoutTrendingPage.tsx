import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Line, LineChart, ResponsiveContainer } from 'recharts'
import { Card } from '@/components/ui/Card'
import { StatTile } from '@/components/analytics/StatTile'
import { PreviewBanner } from '@/components/preview/PreviewBanner'
import { DisabledAction } from '@/components/preview/DisabledAction'
import { ExampleDataCaption } from '@/components/preview/ExampleDataCaption'

type Saturation = 'Low' | 'Medium'

const PRODUCTS: {
  name: string
  interest: string
  saturation: Saturation
  why: string
  trend: number[]
}[] = [
  {
    name: 'Ceramic plant pots',
    interest: '+340% search interest',
    saturation: 'Low',
    why: 'Search interest tripled in six weeks while ad-library activity stays thin. Home-decor creators are driving organic demand faster than sellers are moving in.',
    trend: [12, 14, 13, 18, 24, 31, 42, 53],
  },
  {
    name: 'Linen aprons',
    interest: '+180% search interest',
    saturation: 'Low',
    why: 'A steady climb tied to home-cooking and craft content. Few active ad campaigns, so paid reach is still cheap.',
    trend: [10, 12, 15, 14, 19, 22, 26, 28],
  },
  {
    name: 'Magnetic cable organizers',
    interest: '+120% search interest',
    saturation: 'Medium',
    why: 'Desk-setup videos keep resurfacing this category. Competition is rising, but demand is rising faster.',
    trend: [18, 17, 21, 24, 23, 29, 34, 40],
  },
  {
    name: 'Travel jewelry cases',
    interest: '+95% search interest',
    saturation: 'Low',
    why: 'Consistent growth from packing and travel-hack content. Almost no dedicated ad spend detected yet.',
    trend: [14, 16, 15, 18, 20, 23, 25, 27],
  },
  {
    name: 'Collapsible water bottles',
    interest: '+85% search interest',
    saturation: 'Medium',
    why: 'Summer travel searches lifted the whole category. Saturation is building, so the window is months, not quarters.',
    trend: [20, 22, 26, 25, 30, 33, 35, 37],
  },
  {
    name: 'Cork yoga blocks',
    interest: '+60% search interest',
    saturation: 'Low',
    why: 'A slow, steady riser attached to home-fitness routines. Low ad activity and strong repeat-purchase signals.',
    trend: [11, 12, 14, 15, 15, 17, 18, 18],
  },
]

function SaturationChip({ level }: { level: Saturation }) {
  return level === 'Low' ? (
    <span className="rounded-full bg-accent-tint px-2.5 py-0.5 text-xs font-medium text-accent">
      Low ad saturation
    </span>
  ) : (
    <span className="rounded-full bg-surface-hover px-2.5 py-0.5 text-xs font-medium text-ink-muted">
      Medium ad saturation
    </span>
  )
}

function Sparkline({ points }: { points: number[] }) {
  const data = points.map((v, i) => ({ i, v }))
  return (
    <div className="h-9 w-28" aria-hidden>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 2, bottom: 4, left: 2 }}>
          <Line type="monotone" dataKey="v" stroke="#1a73e8" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function ScoutTrendingPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="flex flex-col gap-6">
      <PreviewBanner module="scout" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatTile value={23} label="Products tracked" />
        <StatTile value={3} label="Rising this week" />
        <StatTile value="Low" label="Avg. ad saturation" />
      </div>
      <Card>
        <h2 className="text-sm font-semibold text-ink">Rising products</h2>
        <p className="mt-1 text-xs text-ink-muted">
          Ranked by rising interest and low saturation across marketplaces, ad libraries, and
          social platforms.
        </p>
        <div className="mt-4 flex flex-col divide-y divide-border-light">
          {PRODUCTS.map((product, i) => {
            const open = openIndex === i
            return (
              <div key={product.name} className="py-4">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <div className="min-w-48 flex-1">
                    <p className="text-sm font-medium text-ink">{product.name}</p>
                    <p className="mt-0.5 text-sm font-medium text-accent">{product.interest}</p>
                  </div>
                  <SaturationChip level={product.saturation} />
                  <Sparkline points={product.trend} />
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenIndex(open ? null : i)}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-ink-secondary transition-colors duration-150 hover:bg-surface-hover hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                  >
                    Why is this rising?
                    <ChevronDown
                      className={`size-4 transition-transform duration-200 ease-out ${open ? 'rotate-180' : ''}`}
                      aria-hidden
                    />
                  </button>
                </div>
                {open && (
                  <div className="mt-3 rounded-xl bg-page p-4 animate-[fade-in_150ms_ease-out]">
                    <p className="text-sm leading-relaxed text-ink-secondary">{product.why}</p>
                    <DisabledAction label="Track this product" className="mt-3" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <ExampleDataCaption />
      </Card>
    </div>
  )
}
