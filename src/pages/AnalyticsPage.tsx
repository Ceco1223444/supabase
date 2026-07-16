import { useMemo } from 'react'
import { useEmailLogs } from '@/hooks/useEmailLogs'
import { usePolicyRequests } from '@/hooks/usePolicyRequests'
import { StatTile } from '@/components/analytics/StatTile'
import { LabelDonutChart } from '@/components/analytics/LabelDonutChart'
import { DailyVolumeLineChart } from '@/components/analytics/DailyVolumeLineChart'
import { Card } from '@/components/ui/Card'

const SENT_STATUSES = new Set(['sent', 'auto_sent'])

// Editorial before/after — short, confident one-line contrasts.
const COMPARISONS = [
  ['Hours to first reply', 'Minutes to first reply'],
  ['Every email drafted by hand', 'Drafts ready for review on arrival'],
  ['Backlogs after every busy day', 'Routine replies send themselves'],
  ['Tone depends on who answers', 'One consistent voice in every reply'],
] as const

export function AnalyticsPage() {
  const { data: emailLogs, isLoading } = useEmailLogs()
  const { data: policyRequests } = usePolicyRequests()

  const stats = useMemo(() => {
    const logs = emailLogs ?? []
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const todayKey = now.toISOString().slice(0, 10)

    const sentThisWeek = logs.filter(
      (l) =>
        SENT_STATUSES.has(l.status ?? '') && l.created_at && new Date(l.created_at) >= weekAgo,
    )
    const autoSentThisWeek = sentThisWeek.filter((l) => l.status === 'auto_sent').length
    const autoSendRate =
      sentThisWeek.length > 0
        ? `${Math.round((autoSentThisWeek / sentThisWeek.length) * 100)}%`
        : '—'

    const awaitingReview = logs.filter((l) => l.status === 'pending_review').length
    const resolvedToday = logs.filter(
      (l) => SENT_STATUSES.has(l.status ?? '') && l.created_at?.slice(0, 10) === todayKey,
    ).length
    const pendingPolicies = (policyRequests ?? []).filter((p) => p.status === 'Pending').length

    const labelCounts: Record<string, number> = {}
    for (const log of logs) {
      if (log.label) labelCounts[log.label] = (labelCounts[log.label] ?? 0) + 1
    }

    const dayCounts: Record<string, number> = {}
    for (const log of logs) {
      if (!log.created_at) continue
      const day = log.created_at.slice(0, 10)
      dayCounts[day] = (dayCounts[day] ?? 0) + 1
    }
    const dailyVolume = Object.entries(dayCounts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }))

    return { autoSendRate, awaitingReview, resolvedToday, pendingPolicies, labelCounts, dailyVolume }
  }, [emailLogs, policyRequests])

  if (isLoading) return <p className="text-sm text-ink-muted">Loading…</p>

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        <StatTile value={stats.autoSendRate} label="auto-sent this week" />
        <StatTile value={stats.awaitingReview} label="drafts awaiting review" />
        <StatTile value={stats.resolvedToday} label="resolved today" />
        <StatTile value={stats.pendingPolicies} label="pending policy updates" />
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="mb-1 text-sm font-semibold text-ink">Label distribution</h2>
          <p className="mb-4 text-xs text-ink-muted">By category</p>
          <LabelDonutChart counts={stats.labelCounts} />
        </Card>
        <Card>
          <h2 className="mb-1 text-sm font-semibold text-ink">Daily volume</h2>
          <p className="mb-4 text-xs text-ink-muted">Emails per day</p>
          <DailyVolumeLineChart data={stats.dailyVolume} />
        </Card>
      </div>
      <Card>
        <h2 className="text-sm font-semibold text-ink">Before and after</h2>
        <p className="mt-1 text-xs text-ink-muted">
          What changes when Ansera writes the first draft
        </p>
        <div className="mt-5 grid grid-cols-2 gap-x-8 pb-3">
          <p className="text-xs font-medium text-ink-muted">Manual support</p>
          <p className="text-xs font-medium text-accent">With Ansera</p>
        </div>
        <div className="flex flex-col divide-y divide-border-light">
          {COMPARISONS.map(([before, after]) => (
            <div key={after} className="grid grid-cols-2 gap-x-8 py-3">
              <p className="text-sm text-ink-muted">{before}</p>
              <p className="text-sm text-ink">{after}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
