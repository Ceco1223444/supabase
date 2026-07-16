import { Card } from '@/components/ui/Card'
import { PreviewWidget } from '@/components/ui/PreviewWidget'
import { PreviewBanner } from '@/components/preview/PreviewBanner'
import { DisabledAction } from '@/components/preview/DisabledAction'
import { ExampleDataCaption } from '@/components/preview/ExampleDataCaption'
import { VideoThumb } from '@/components/preview/VideoThumb'

const WEEK: { day: string; video?: { title: string; time: string; platforms: string[] } }[] = [
  { day: 'Mon' },
  { day: 'Tue', video: { title: 'Product demo — Ceramic plant pot', time: '6:00 PM', platforms: ['TikTok', 'Reels'] } },
  { day: 'Wed' },
  { day: 'Thu', video: { title: 'Behind the scenes — packing orders', time: '6:00 PM', platforms: ['TikTok', 'Reels'] } },
  { day: 'Fri' },
  { day: 'Sat', video: { title: 'Customer question — shipping times', time: '11:00 AM', platforms: ['TikTok', 'Reels'] } },
  { day: 'Sun' },
]

export function StudioCalendarPage() {
  return (
    <div className="flex flex-col gap-6">
      <PreviewBanner module="studio" />
      <PreviewWidget
        parts={['Scheduled', '3 videos this week', 'TikTok + Instagram Reels', 'Auto-posting Tue/Thu/Sat']}
        live={false}
      />
      <Card>
        <h2 className="text-sm font-semibold text-ink">This week</h2>
        <p className="mt-1 text-xs text-ink-muted">
          Studio scripts, generates, and posts on your schedule — nothing to film.
        </p>
        <div className="mt-4 overflow-x-auto">
          <div className="grid min-w-[840px] grid-cols-7 gap-3">
            {WEEK.map(({ day, video }) => (
              <div key={day} className="flex flex-col gap-2">
                <p className="text-center text-xs font-medium text-ink-muted">{day}</p>
                {video ? (
                  <div className="flex flex-col gap-2 rounded-xl bg-page p-2.5 shadow-soft">
                    <VideoThumb />
                    <p className="text-xs font-medium leading-snug text-ink">{video.title}</p>
                    <div className="flex flex-wrap gap-1">
                      {video.platforms.map((platform) => (
                        <span
                          key={platform}
                          className="rounded-full bg-surface-hover px-2 py-px text-[10px] font-medium text-ink-muted"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-ink-muted">{video.time}</span>
                      <span className="rounded-full bg-accent-tint px-2 py-px text-[10px] font-medium text-accent">
                        Scheduled
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="min-h-40 flex-1 rounded-xl border border-dashed border-border-light" aria-hidden />
                )}
              </div>
            ))}
          </div>
        </div>
        <ExampleDataCaption />
      </Card>
      <DisabledAction label="Approve calendar" />
    </div>
  )
}
