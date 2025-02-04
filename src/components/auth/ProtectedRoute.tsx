import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const supabase = useSupabaseClient()
  const user = useUser()
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth/signin')
      }
    }

    checkUser()
  }, [user, router, supabase])

  if (!user) {
    return <div>Loading...</div>
  }

  return <>{children}</>
} 