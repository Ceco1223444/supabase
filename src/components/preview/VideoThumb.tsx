import { Play } from 'lucide-react'

/**
 * 9:16 short-form video placeholder in the flat warm vocabulary of the
 * landing scenes — no fake screenshot, just an honest stand-in frame.
 */
export function VideoThumb() {
  return (
    <div
      className="relative flex aspect-[9/16] items-center justify-center overflow-hidden rounded-lg"
      style={{ background: 'linear-gradient(160deg, #f4efe4, #e7dcc4)' }}
      aria-hidden
    >
      <span className="absolute -left-4 -top-5 size-16 rounded-full bg-[#dce9fc] opacity-70" />
      <span className="absolute -bottom-6 -right-4 size-20 rounded-full bg-[#f0e8d6]" />
      <span className="relative flex size-9 items-center justify-center rounded-full bg-white/85 shadow-soft">
        <Play className="size-4 translate-x-px text-ink-secondary" />
      </span>
    </div>
  )
}
