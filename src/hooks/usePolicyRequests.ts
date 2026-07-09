import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/auth/useAuth'

export function usePolicyRequests() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['policy_requests', user?.email],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('policy_requests')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
    enabled: !!user?.email,
  })
}

export function useCreatePolicyRequest() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (requestDetails: string) => {
      const { error } = await supabase
        .from('policy_requests')
        .insert({ user_email: user!.email!, request_details: requestDetails })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policy_requests', user?.email] })
    },
  })
}
