'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { WordResult } from './word-result'
import { Loader2, Search } from 'lucide-react'

interface Word {
  id: string
  word: string
  meaningCn: string
  phoneticUk?: string
  phoneticUs?: string
  audioUk?: string
  audioUs?: string
  exampleSentence?: string
  exampleTranslation?: string
  partOfSpeech?: string
}

export function WordSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchResult, setSearchResult] = useState<Word | null>(null)
  const [error, setError] = useState('')

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a word to search')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/words/search?q=${encodeURIComponent(searchTerm.trim())}`)

      if (!response.ok) {
        throw new Error('Failed to search word')
      }

      const data = await response.json()
      setSearchResult(data)
    } catch (error) {
      console.error('Error searching word:', error)
      setError('Failed to search word. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex space-x-4">
            <Input
              type="text"
              placeholder="Enter an English word..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="px-6"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {searchResult && (
        <WordResult
          word={searchResult}
          onWordUpdated={(updatedWord) => setSearchResult(updatedWord)}
        />
      )}
    </div>
  )
}