import { useMutation } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'

export function useRefineReply() {
  return useMutation({
    mutationFn: async ({
      emailLogId,
      currentText,
      instruction,
    }: {
      emailLogId: number
      currentText: string
      instruction: string
    }) => {
      const { data, error } = await supabase.functions.invoke('refine-reply', {
        body: { email_log_id: emailLogId, current_text: currentText, instruction },
      })
      if (error || data?.error) {
        throw new Error(data?.error ?? error?.message ?? 'Failed to refine')
      }
      return data.refined_text as string
    },
  })
}
