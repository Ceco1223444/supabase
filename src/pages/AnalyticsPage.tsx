import { useMemo } from 'react'
import { useEmailLogs } from '@/hooks/useEmailLogs'
import { usePolicyRequests } from '@/hooks/usePolicyRequests'
import { StatTile } from '@/components/analytics/StatTile'
import { LabelDonutChart } from '@/components/analytics/LabelDonutChart'
import { DailyVolumeLineChart } from '@/components/analytics/DailyVolumeLineChart'
import { Card } from '@/components/ui/Card'

export function AnalyticsPage() {
  const { data: emailLogs, isLoading } = useEmailLogs()
  const { data: policyRequests } = usePolicyRequests()

  const stats = useMemo(() => {
    const logs = emailLogs ?? []
    const uniqueSenders = new Set(logs.map((l) => l.sender_email).filter(Boolean))
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

    return {
      total: logs.length,
      uniqueSenders: uniqueSenders.size,
      pendingPolicies,
      labelCounts,
      dailyVolume,
    }
  }, [emailLogs, policyRequests])

  if (isLoading) return <p className="text-sm text-ink-muted">Loading…</p>

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile label="Total Automation Actions" value={stats.total} />
        <StatTile label="Active Unique Senders" value={stats.uniqueSenders} />
        <StatTile label="Pending Policy Overhauls" value={stats.pendingPolicies} />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-1 text-sm font-semibold text-ink">Label Distribution</h2>
          <p className="mb-4 text-xs text-ink-muted">By category</p>
          <LabelDonutChart counts={stats.labelCounts} />
        </Card>
        <Card>
          <h2 className="mb-1 text-sm font-semibold text-ink">Daily Operational Volume</h2>
          <p className="mb-4 text-xs text-ink-muted">Emails / day</p>
          <DailyVolumeLineChart data={stats.dailyVolume} />
        </Card>
      </div>
    </div>
  )
}
