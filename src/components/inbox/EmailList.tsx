import { useMemo, useState } from 'react'
import { useEmailLogs } from '@/hooks/useEmailLogs'
import { Input } from '@/components/ui/Input'
import { EmailListItem } from './EmailListItem'

export function EmailList() {
  const { data, isLoading, error } = useEmailLogs()
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!data) return []
    const q = search.trim().toLowerCase()
    if (!q) return data
    return data.filter(
      (e) =>
        e.sender_email?.toLowerCase().includes(q) ||
        e.subject?.toLowerCase().includes(q) ||
        e.label?.toLowerCase().includes(q),
    )
  }, [data, search])

  return (
    <div className="flex h-full flex-col">
      <Input
        placeholder="Search sender, subject, label…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 shadow-soft"
      />
      {isLoading && <p className="text-sm text-ink-muted">Loading…</p>}
      {error && <p className="text-sm text-cat-6-text">Failed to load emails.</p>}
      {!isLoading && filtered.length === 0 && (
        <p className="text-sm text-ink-muted">No emails yet.</p>
      )}
      {/* Slight negative margin + padding so card shadows aren't clipped by the scroll container. */}
      <div className="-mx-1 flex flex-col gap-3 overflow-y-auto px-1 pb-2">
        {filtered.map((email) => (
          <EmailListItem key={email.id} email={email} />
        ))}
      </div>
    </div>
  )
}
