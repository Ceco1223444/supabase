import { Sparkles } from 'lucide-react'
import type { PreviewModuleId } from '@/lib/modules'
import { NotifyMeButton } from './NotifyMeButton'

const MODULE_NAMES: Record<PreviewModuleId, string> = {
  sites: 'Ansera Sites',
  scout: 'Ansera Scout',
  studio: 'Ansera Studio',
}

/** Slim honesty strip at the top of every preview-module screen. */
export function PreviewBanner({ module }: { module: PreviewModuleId }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-accent-tint/60 px-4 py-3 sm:flex-row sm:items-center">
      <Sparkles className="hidden size-4 shrink-0 text-accent sm:block" aria-hidden />
      <p className="flex-1 text-sm leading-relaxed text-ink-secondary">
        <span className="font-medium text-ink">{MODULE_NAMES[module]} is in preview.</span> The
        data below is an example of what launch looks like. Join the waitlist and we'll email you
        when it opens up.
      </p>
      <NotifyMeButton module={module} />
    </div>
  )
}
