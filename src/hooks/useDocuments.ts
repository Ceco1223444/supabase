import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'

export function useDocuments() {
  return useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('id, content, metadata')
        .order('id', { ascending: false })
      if (error) throw error
      return data
    },
  })
}
