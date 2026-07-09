import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/auth/useAuth'

export function useRecommendations() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['ai_recommendations', user?.email],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_recommendations')
        .select('*')
        .eq('email', user!.email!)
        .maybeSingle()
      if (error) throw error
      return data
    },
    enabled: !!user?.email,
  })
}
