import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export const SupabaseTest = () => {
  const [tables, setTables] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchTables() {
      try {
        const { data, error } = await supabase
          .from('information_schema.tables')
          .select('table_name')
          .eq('table_schema', 'public')

        if (error) throw error

        setTables(data.map(table => table.table_name))
      } catch (err) {
        console.error('Error fetching tables:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch tables')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTables()
  }, [])

  if (isLoading) {
    return <div>Testing Supabase connection...</div>
  }

  if (error) {
    return <div className="text-red-600">Error: {error}</div>
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Supabase Tables:</h2>
      {tables.length === 0 ? (
        <p>No tables found in the public schema</p>
      ) : (
        <ul className="list-disc list-inside">
          {tables.map(table => (
            <li key={table}>{table}</li>
          ))}
        </ul>
      )}
    </div>
  )
} 