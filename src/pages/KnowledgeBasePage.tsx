import { DocumentList } from '@/components/knowledgeBase/DocumentList'

export function KnowledgeBasePage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold text-ink">Knowledge Base</h1>
      <p className="text-sm text-ink-muted">
        Read-only view of your ingested FAQ/policy chunks used by the AI agent.
      </p>
      <DocumentList />
    </div>
  )
}
