import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabaseClient'

type TestResponse = {
  status: 'success' | 'error'
  message: string
  tables?: string[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TestResponse>
) {
  try {
    // Simple connection test
    const { data, error } = await supabase
      .from('searches')
      .select('count')
      .limit(1)

    if (error) {
      throw error
    }

    // If we get here, connection is working
    return res.status(200).json({
      status: 'success',
      message: 'Successfully connected to Supabase',
      tables: ['searches'] // We know this table exists if the query worked
    })

  } catch (error) {
    console.error('Database test error:', error)
    return res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to connect to database'
    })
  }
} 