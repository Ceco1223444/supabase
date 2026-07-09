import { useParams } from 'react-router-dom'
import { useEmailLog } from '@/hooks/useEmailLogs'
import { ThreadDetail } from '@/components/inbox/ThreadDetail'

export function InboxThreadPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, error } = useEmailLog(id ? Number(id) : undefined)

  if (isLoading) return <p className="text-sm text-ink-muted">Loading…</p>
  if (error || !data) return <p className="text-sm text-cat-6">Email not found.</p>

  return <ThreadDetail email={data} />
}
