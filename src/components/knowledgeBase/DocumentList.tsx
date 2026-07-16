import { useState } from 'react'
import { useDocuments } from '@/hooks/useDocuments'
import { Card } from '@/components/ui/Card'
import { DocumentDetailModal } from './DocumentDetailModal'

export function DocumentList() {
  const { data, isLoading, error } = useDocuments()
  const [selected, setSelected] = useState<string | null>(null)

  if (isLoading) return <p className="text-sm text-ink-muted">Loading…</p>
  if (error) return <p className="text-sm text-cat-6-text">Failed to load knowledge base.</p>
  if (!data || data.length === 0) {
    return <p className="text-sm text-ink-muted">No FAQ/policy documents ingested yet.</p>
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((doc) => (
          <Card
            key={doc.id}
            role="button"
            tabIndex={0}
            className="cursor-pointer transition-all duration-200 ease-out hover:shadow-raised active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-page"
            onClick={() => setSelected(doc.content ?? '')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setSelected(doc.content ?? '')
              }
            }}
          >
            <p className="line-clamp-4 text-sm text-ink-secondary">{doc.content}</p>
          </Card>
        ))}
      </div>
      {selected !== null && (
        <DocumentDetailModal content={selected} onClose={() => setSelected(null)} />
      )}
    </>
  )
}
