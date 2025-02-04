import { useState } from 'react'
import { useSearch } from '@/hooks/useSearch'
import { useSession } from 'next-auth/react'
import { SignupModal } from '../auth/SignupModal'

export const SearchInterface = () => {
  const [prompt, setPrompt] = useState('')
  const { performSearch, isLoading } = useSearch()
  const { data: session } = useSession()
  const [showSignup, setShowSignup] = useState(false)

  const handleSearch = async () => {
    if (!session) {
      setShowSignup(true)
      return
    }

    // Perform the search
    const urls = prompt.split('\n').filter(url => url.trim())
    await performSearch(urls)
  }

  return (
    <>
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#111111] text-white px-4">
        <div className="w-full max-w-3xl space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold">
              Idea to app in seconds.
            </h1>
            <p className="text-xl text-gray-400">
              Sales Prospector is your superhuman lead generation assistant.
            </p>
          </div>

          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask Sales Prospector to find leads for..."
              className="w-full h-32 p-4 rounded-lg bg-[#1A1A1A] text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            
            <div className="absolute bottom-4 right-4 flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-white">
                <span className="sr-only">Attach file</span>
                📎
              </button>
              <button className="p-2 text-gray-400 hover:text-white">
                <span className="sr-only">Import</span>
                ↓
              </button>
              <button 
                onClick={handleSearch}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                disabled={isLoading}
              >
                <span>{isLoading ? 'Searching...' : 'Search'}</span>
                <span>→</span>
              </button>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button className="px-4 py-2 rounded-md bg-[#1A1A1A] text-gray-300 hover:bg-[#252525]">
              My Projects
            </button>
            <button className="px-4 py-2 rounded-md bg-[#1A1A1A] text-gray-300 hover:bg-[#252525]">
              Latest
            </button>
            <button className="px-4 py-2 rounded-md bg-[#1A1A1A] text-gray-300 hover:bg-[#252525]">
              Featured
            </button>
            <button className="px-4 py-2 rounded-md bg-[#1A1A1A] text-gray-300 hover:bg-[#252525]">
              Templates
            </button>
          </div>
        </div>
      </div>

      <SignupModal 
        isOpen={showSignup} 
        onClose={() => setShowSignup(false)} 
      />
    </>
  )
} 