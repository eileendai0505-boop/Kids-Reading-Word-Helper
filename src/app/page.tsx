import { useState } from 'react'
import { WordSearch } from '@/components/word-search'
import { WordResult } from '@/components/word-result'

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Kids Reading Word Helper
        </h1>
        <p className="text-lg text-gray-600">
          Search for English words, learn meanings, and create study groups
        </p>
      </div>

      <div className="space-y-8">
        <WordSearch />
      </div>
    </main>
  )
}