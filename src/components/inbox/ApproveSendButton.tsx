import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/Button'

export function ApproveSendButton({
  emailLogId,
  finalResponse,
}: {
  emailLogId: number
  finalResponse: string
}) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const queryClient = useQueryClient()

  async function handleApprove() {
    setState('sending')
    setErrorMessage(null)
    const { data, error } = await supabase.functions.invoke('approve-reply', {
      body: { email_log_id: emailLogId, final_response: finalResponse },
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
    return <p className="text-sm text-cat-2">Sent successfully.</p>
  }

  return (
    <div className="flex items-center gap-3">
      <Button onClick={handleApprove} disabled={state === 'sending'}>
        {state === 'sending' ? 'Sending…' : 'Approve & Send'}
      </Button>
      {state === 'error' && <p className="text-sm text-cat-6">{errorMessage}</p>}
    </div>
  )
}
