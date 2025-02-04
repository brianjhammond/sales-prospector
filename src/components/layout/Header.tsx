import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'

export const Header = () => {
  const { data: session } = useSession()

  return (
    <header className="bg-[#111111] text-white">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-2xl font-bold gradient-text">Sales Prospector</div>
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link href="/support" className="text-gray-300 hover:text-white">
                Support
              </Link>
              <Link href="/blog" className="text-gray-300 hover:text-white">
                Blog
              </Link>
              <Link href="/learn" className="text-gray-300 hover:text-white">
                Learn
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => signOut()}
                  className="text-gray-300 hover:text-white"
                >
                  Sign Out
                </button>
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-orange-400 via-pink-500 to-blue-500" />
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-100"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
} 