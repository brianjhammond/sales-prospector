import { useState, FormEvent } from 'react'
import { useSearch } from '@/hooks/useSearch'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { SearchResults } from './SearchResults'
import { CrawlResult } from '@/services/crawler'
import { ErrorMessage } from '../error/ErrorMessage'

export const SearchBar = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<CrawlResult[]>([])
  const { performSearch, isLoading } = useSearch()
  const { data: session } = useSession()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    try {
      const urls = query.split('\n').filter(url => url.trim())
      const searchResults = await performSearch(urls)
      setResults(searchResults)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during search')
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter URLs (one per line)..."
          className="w-full p-2 border border-gray-300 rounded-md"
          rows={5}
        />
        {error && <ErrorMessage error={error} />}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {results.length > 0 && <SearchResults results={results} />}
    </div>
  )
} 