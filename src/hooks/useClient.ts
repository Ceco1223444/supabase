import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/auth/useAuth'

export function useClient() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['clients', user?.email],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('email', user!.email!)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!user?.email,
  })
}

export function useUpdateAutoSend() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (autoSend: boolean) => {
      const { error } = await supabase
        .from('clients')
        .update({ auto_send: autoSend })
        .eq('email', user!.email!)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients', user?.email] })
    },
  })
}
