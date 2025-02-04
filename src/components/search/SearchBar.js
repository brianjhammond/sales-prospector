import { useState } from 'react'
import { useSearch } from '@/hooks/useSearch'

export const SearchBar = () => {
  const [query, setQuery] = useState('')
  const { performSearch, isLoading } = useSearch()

  const handleSubmit = (e) => {
    e.preventDefault()
    performSearch(query)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search prospects..."
        className="search-input"
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </form>
  )
} 