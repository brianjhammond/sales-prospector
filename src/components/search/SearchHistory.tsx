import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import type { CrawlResult } from '@/services/crawler'

type SearchRecord = {
  id: string
  urls: string[]
  results: CrawlResult[]
  created_at: string
}

export const SearchHistory = () => {
  const supabase = useSupabaseClient()
  const user = useUser()
  const [searches, setSearches] = useState<SearchRecord[]>([])

  useEffect(() => {
    if (user) {
      const fetchSearches = async () => {
        const { data, error } = await supabase
          .from('searches')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10)

        if (!error && data) {
          setSearches(data)
        }
      }

      fetchSearches()
    }
  }, [user, supabase])

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Recent Searches</h2>
      <div className="space-y-4">
        {searches.map((search) => (
          <div key={search.id} className="bg-white p-4 rounded-lg shadow">
            <div className="font-medium">URLs searched:</div>
            <ul className="ml-4 list-disc">
              {search.urls.map((url, index) => (
                <li key={index}>{url}</li>
              ))}
            </ul>
            <div className="text-sm text-gray-500 mt-2">
              {new Date(search.created_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 