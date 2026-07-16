import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Check } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/Button'

export function ApproveSendButton({
  emailLogId,
  finalResponse,
  refinementPrompts = [],
}: {
  emailLogId: number
  finalResponse: string
  refinementPrompts?: string[]
}) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const queryClient = useQueryClient()

  async function handleApprove() {
    setState('sending')
    setErrorMessage(null)
    const { data, error } = await supabase.functions.invoke('approve-reply', {
      body: { email_log_id: emailLogId, final_response: finalResponse, refinement_prompts: refinementPrompts },
    })
    if (error || data?.error) {
      setState('error')
      setErrorMessage(data?.error ?? error?.message ?? 'Failed to send')
      return
    }
    setState('sent')
    queryClient.invalidateQueries({ queryKey: ['email_logs'] })
  }

  if (state === 'sent') {
    return (
      <div className="flex items-center gap-2 rounded-full bg-cat-2/12 px-4 py-2 text-sm font-medium text-cat-2-text animate-[fade-in_200ms_ease-out]">
        <Check className="h-4 w-4 animate-[check-in_200ms_ease-out]" strokeWidth={2.5} />
        Sent
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <Button onClick={handleApprove} disabled={state === 'sending'}>
        {state === 'sending' ? 'Sending…' : 'Approve & Send'}
      </Button>
      {state === 'error' && (
        <p className="text-sm text-cat-6-text animate-[fade-in_200ms_ease-out]">{errorMessage}</p>
      )}
    </div>
  )
}
