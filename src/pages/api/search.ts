import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { EnhancedCrawlerService, CrawlResult } from '@/services/crawler'
import { rateLimiterMiddleware } from '@/middleware/rateLimiter'
import { Database } from '@/types/database'

type SearchResponse = {
  results: CrawlResult[]
  message?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchResponse>
) {
  // Initialize Supabase client
  const supabase = createServerSupabaseClient<Database>({ req, res })

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return res.status(401).json({
      results: [],
      message: 'Unauthorized'
    })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ results: [], message: 'Method not allowed' })
  }

  try {
    const { urls } = req.body

    if (!Array.isArray(urls)) {
      return res.status(400).json({
        results: [],
        message: 'URLs must be provided as an array'
      })
    }

    await rateLimiterMiddleware(req, res, async () => {
      const results = await EnhancedCrawlerService.crawlMultipleUrls(urls)
      
      // Store search results in Supabase
      const { error: insertError } = await supabase
        .from('searches')
        .insert({
          user_id: session.user.id,
          urls,
          results
        })

      if (insertError) {
        console.error('Error storing search:', insertError)
      }

      return res.status(200).json({ results })
    })
  } catch (error) {
    console.error('Search error:', error)
    return res.status(500).json({
      results: [],
      message: error instanceof Error ? error.message : 'Internal server error'
    })
  }
} 