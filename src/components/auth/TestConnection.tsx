import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'

export const TestConnection = () => {
  const supabase = useSupabaseClient()
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading')

  useEffect(() => {
    const testConnection = async () => {
      try {
        const { data, error } = await supabase
          .from('searches')
          .select('count')
          .limit(1)

        if (error) throw error
        setStatus('connected')
      } catch (error) {
        console.error('Connection error:', error)
        setStatus('error')
      }
    }

    testConnection()
  }, [supabase])

  return (
    <div className="text-sm">
      Status: {
        status === 'loading' ? '🔄 Checking connection...' :
        status === 'connected' ? '✅ Connected to Supabase' :
        '❌ Connection error'
      }
    </div>
  )
} 