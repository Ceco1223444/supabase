import { Card } from '@/components/ui/Card'
import { PreviewBanner } from '@/components/preview/PreviewBanner'
import { ExampleDataCaption } from '@/components/preview/ExampleDataCaption'
import { VideoThumb } from '@/components/preview/VideoThumb'

type Stage = 'Scripted' | 'Generated' | 'Posted'

const VIDEOS: { title: string; stage: Stage }[] = [
  { title: 'Product demo — Ceramic plant pot', stage: 'Posted' },
  { title: 'Behind the scenes — packing orders', stage: 'Posted' },
  { title: 'Customer question — shipping times', stage: 'Generated' },
  { title: 'Product demo — Linen apron', stage: 'Generated' },
  { title: 'Unboxing — Travel jewelry case', stage: 'Scripted' },
  { title: 'Care guide — Cork yoga block', stage: 'Scripted' },
]

function StagePill({ stage }: { stage: Stage }) {
  if (stage === 'Posted') {
    return (
      <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-white">Posted</span>
    )
  }
  if (stage === 'Generated') {
    return (
      <span className="rounded-full bg-accent-tint px-2.5 py-0.5 text-xs font-medium text-accent">
        Generated
      </span>
    )
  }
  return (
    <span className="rounded-full bg-surface-hover px-2.5 py-0.5 text-xs font-medium text-ink-muted">
      Scripted
    </span>
  )
}

export function StudioLibraryPage() {
  return (
    <div className="flex flex-col gap-6">
      <PreviewBanner module="studio" />
      <Card>
        <h2 className="text-sm font-semibold text-ink">Library</h2>
        <p className="mt-1 text-xs text-ink-muted">
          Every video moves through the same pipeline: scripted, generated, posted.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {VIDEOS.map((video) => (
            <div key={video.title} className="flex flex-col gap-2">
              <VideoThumb />
              <p className="text-xs font-medium leading-snug text-ink">{video.title}</p>
              <div>
                <StagePill stage={video.stage} />
              </div>
            </div>
          ))}
        </div>
        <ExampleDataCaption />
      </Card>
    </div>
  )
}
