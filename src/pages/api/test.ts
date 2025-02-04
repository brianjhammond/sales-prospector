import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabaseClient'
import { EnhancedCrawlerService } from '@/services/crawler'

type TestResponse = {
  status: 'success' | 'error'
  dbConnection?: {
    status: 'success' | 'error'
    message: string
  }
  crawlerTest?: {
    status: 'success' | 'error'
    results?: any
    error?: string
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TestResponse>
) {
  try {
    // Test 1: Database Connection
    const dbTest = await testDatabaseConnection()
    
    // Test 2: Crawler
    const crawlerTest = await testCrawler()

    return res.status(200).json({
      status: 'success',
      dbConnection: dbTest,
      crawlerTest
    })

  } catch (error) {
    console.error('Test failed:', error)
    return res.status(500).json({
      status: 'error',
      dbConnection: {
        status: 'error',
        message: 'Failed to run tests'
      }
    })
  }
}

async function testDatabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('searches')
      .select('count')
      .limit(1)

    if (error) throw error

    return {
      status: 'success',
      message: 'Successfully connected to Supabase'
    }
  } catch (error) {
    console.error('Database test error:', error)
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to connect to database'
    }
  }
}

async function testCrawler() {
  try {
    const testUrl = 'https://example.com'
    const result = await EnhancedCrawlerService.crawlUrl(testUrl)

    return {
      status: 'success',
      results: result
    }
  } catch (error) {
    console.error('Crawler test error:', error)
    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'Failed to test crawler'
    }
  }
} 