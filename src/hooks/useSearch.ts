import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { CrawlResult } from '@/services/crawler'

export function useSearch() {
  const [isLoading, setIsLoading] = useState(false)

  const performSearch = async (urls: string[]): Promise<CrawlResult[]> => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ urls }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to perform search')
      }

      const { results } = await response.json()
      return results
    } finally {
      setIsLoading(false)
    }
  }

  return {
    performSearch,
    isLoading,
  }
} 