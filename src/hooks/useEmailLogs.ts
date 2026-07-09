import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'

export function useEmailLogs() {
  return useQuery({
    queryKey: ['email_logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_logs')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })
}

export function useEmailLog(id: number | undefined) {
  return useQuery({
    queryKey: ['email_logs', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('email_logs').select('*').eq('id', id!).single()
      if (error) throw error
      return data
    },
    enabled: id !== undefined,
  })
}
