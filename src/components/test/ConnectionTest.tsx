import { useEffect, useState } from 'react'

type TestResponse = {
  status: 'success' | 'error'
  message: string
  tables?: string[]
}

export const ConnectionTest = () => {
  const [status, setStatus] = useState<TestResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function testConnection() {
      try {
        const response = await fetch('/api/test-db')
        const data = await response.json()
        setStatus(data)
      } catch (error) {
        setStatus({
          status: 'error',
          message: 'Failed to test connection'
        })
      } finally {
        setLoading(false)
      }
    }

    testConnection()
  }, [])

  if (loading) {
    return <div>Testing database connection...</div>
  }

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-bold mb-2">Database Connection Status</h2>
      <div className={status?.status === 'success' ? 'text-green-600' : 'text-red-600'}>
        {status?.message}
      </div>
      {status?.tables && (
        <div className="mt-2">
          <div>Available tables:</div>
          <ul className="list-disc list-inside">
            {status.tables.map(table => (
              <li key={table}>{table}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
} 