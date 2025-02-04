import { useEffect, useState } from 'react'

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

export const TestResults = () => {
  const [results, setResults] = useState<TestResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function runTests() {
      try {
        const response = await fetch('/api/test')
        const data = await response.json()
        setResults(data)
      } catch (error) {
        console.error('Test error:', error)
        setResults({
          status: 'error',
          dbConnection: {
            status: 'error',
            message: 'Failed to run tests'
          }
        })
      } finally {
        setLoading(false)
      }
    }

    runTests()
  }, [])

  if (loading) {
    return <div>Running tests...</div>
  }

  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-lg">
        <h2 className="text-lg font-bold mb-2">Database Connection</h2>
        <div className={results?.dbConnection?.status === 'success' ? 'text-green-600' : 'text-red-600'}>
          {results?.dbConnection?.message}
        </div>
      </div>

      <div className="p-4 border rounded-lg">
        <h2 className="text-lg font-bold mb-2">Crawler Test</h2>
        {results?.crawlerTest?.status === 'success' ? (
          <div>
            <div className="text-green-600">Crawler is working</div>
            <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
              {JSON.stringify(results.crawlerTest.results, null, 2)}
            </pre>
          </div>
        ) : (
          <div className="text-red-600">
            {results?.crawlerTest?.error || 'Crawler test failed'}
          </div>
        )}
      </div>
    </div>
  )
} 