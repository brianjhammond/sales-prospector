'use client'

import { Header } from '@/components/layout/Header'
import { SearchInterface } from '@/components/search/SearchInterface'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#111111]">
      <Header />
      <SearchInterface />
    </div>
  )
} 