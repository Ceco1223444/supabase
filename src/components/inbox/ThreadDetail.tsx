import { useEffect, useState } from 'react'
import { ChevronDown, Sparkles } from 'lucide-react'
import { CategoryBadge } from './CategoryBadge'
import { StatusBadge } from './StatusBadge'
import { ApproveSendButton } from './ApproveSendButton'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useRefineReply } from '@/hooks/useRefineReply'
import type { Database } from '@/lib/database.types'

type EmailLog = Database['public']['Tables']['email_logs']['Row']

export function ThreadDetail({ email }: { email: EmailLog }) {
  const [draft, setDraft] = useState(email.final_response ?? email.ai_response ?? '')
  const [expanded, setExpanded] = useState(true)
  const [refinementPrompts, setRefinementPrompts] = useState<string[]>([])
  const [showRefineInput, setShowRefineInput] = useState(false)
  const [instruction, setInstruction] = useState('')
  const [refineError, setRefineError] = useState<string | null>(null)
  const [justRefined, setJustRefined] = useState(false)
  const refineMutation = useRefineReply()

  useEffect(() => {
    setDraft(email.final_response ?? email.ai_response ?? '')
    setRefinementPrompts([])
    setShowRefineInput(false)
    setInstruction('')
    setRefineError(null)
    setJustRefined(false)
  }, [email.id, email.final_response, email.ai_response])

  useEffect(() => {
    if (!justRefined) return
    const timeout = setTimeout(() => setJustRefined(false), 900)
    return () => clearTimeout(timeout)
  }, [justRefined])

  const isGenerating = email.status === 'pending_review' && draft === ''
  const canRefine = email.status === 'pending_review' && !isGenerating

  async function handleRefine() {
    const trimmed = instruction.trim()
    if (!trimmed || refineMutation.isPending) return
    setRefineError(null)
    try {
      const refined = await refineMutation.mutateAsync({
        emailLogId: email.id,
        currentText: draft,
        instruction: trimmed,
      })
      setDraft(refined)
      setRefinementPrompts((prev) => [...prev, trimmed])
      setInstruction('')
      setJustRefined(true)
    } catch (err) {
      setRefineError(err instanceof Error ? err.message : 'Failed to refine')
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <CategoryBadge label={email.label} />
        <StatusBadge status={email.status} />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight text-ink">{email.subject}</h1>
      <p className="text-sm text-ink-muted">From {email.sender_email}</p>

      <Card>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Incoming Message
        </p>
        <p className="whitespace-pre-wrap text-sm text-ink-secondary">{email.incoming_message}</p>
      </Card>

      <Card>
        <div className="mb-2 flex w-full items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
            className="flex items-center gap-2 rounded-sm text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              AI Response
            </span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-ink-muted transition-transform duration-200 ${
                expanded ? 'rotate-180' : ''
              }`}
              aria-hidden="true"
            />
          </button>
          {canRefine && (
            <button
              type="button"
              onClick={() => {
                setShowRefineInput((prev) => !prev)
                setExpanded(true)
              }}
              aria-pressed={showRefineInput}
              title="Refine this reply with AI"
              className={`inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-4 text-sm font-semibold shadow-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
                showRefineInput
                  ? 'bg-accent text-white shadow-md'
                  : 'bg-accent-tint text-accent hover:bg-accent hover:text-white hover:shadow-md'
              } ${refineMutation.isPending ? 'ai-loading-ring' : ''}`}
            >
              <Sparkles
                className={`h-4 w-4 shrink-0 ${refineMutation.isPending ? 'animate-pulse' : ''}`}
                aria-hidden="true"
              />
              <span className="whitespace-nowrap">
                {refineMutation.isPending ? 'Refining…' : 'Refine with AI'}
              </span>
            </button>
          )}
        </div>
        <div
          className="grid transition-[grid-template-rows] duration-200 ease-out"
          style={{ gridTemplateRows: expanded ? '1fr' : '0fr' }}
        >
          <div className="overflow-hidden">
            {isGenerating ? (
              <div
                role="status"
                aria-label="Generating AI draft"
                className="flex flex-col gap-2 rounded-lg bg-page p-3"
              >
                <div className="h-3 w-5/6 rounded skeleton-shimmer" />
                <div className="h-3 w-full rounded skeleton-shimmer" />
                <div className="h-3 w-full rounded skeleton-shimmer" />
                <div className="h-3 w-2/3 rounded skeleton-shimmer" />
              </div>
            ) : email.status === 'pending_review' ? (
              <div className="flex flex-col gap-2">
                {showRefineInput && (
                  <div
                    className={`animate-[scale-in_180ms_ease-out] rounded-lg ${
                      refineMutation.isPending ? 'ai-loading-ring' : 'ai-ring'
                    }`}
                    data-active={refineMutation.isPending ? undefined : 'true'}
                  >
                    <div className="flex items-center gap-2 rounded-lg bg-page p-2">
                      <Sparkles className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                      <Input
                        value={instruction}
                        onChange={(e) => setInstruction(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleRefine()
                          }
                        }}
                        placeholder='What should change? e.g. "make it shorter"'
                        disabled={refineMutation.isPending}
                        autoFocus
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={handleRefine}
                        disabled={refineMutation.isPending || !instruction.trim()}
                        className="shrink-0"
                      >
                        {refineMutation.isPending ? 'Refining…' : 'Refine'}
                      </Button>
                    </div>
                  </div>
                )}
                {refineError && <p className="text-sm text-cat-6-text">{refineError}</p>}
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={10}
                  style={justRefined ? { borderColor: 'var(--color-accent)' } : undefined}
                  className="w-full rounded-lg border border-border bg-page p-3 text-sm text-ink outline-none transition-colors duration-300 focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </div>
            ) : (
              <p className="whitespace-pre-wrap text-sm text-ink-secondary">
                {email.final_response ?? email.ai_response}
              </p>
            )}
          </div>
        </div>
      </Card>

      {email.status === 'pending_review' && !isGenerating && (
        <ApproveSendButton emailLogId={email.id} finalResponse={draft} refinementPrompts={refinementPrompts} />
      )}
    </div>
  )
}
