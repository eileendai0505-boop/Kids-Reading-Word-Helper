'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PronunciationButton } from '@/components/pronunciation-button'
import { FlashcardViewer } from '@/components/flashcard-viewer'
import { ArrowLeft, BookOpen, Trash2, RotateCcw } from 'lucide-react'

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
  wordGroupId: string
  addedAt: string
}

export default function GroupDetailPage() {
  const params = useParams()
  const router = useRouter()
  const groupId = params.id as string

  const [words, setWords] = useState<Word[]>([])
  const [loading, setLoading] = useState(true)
  const [groupName, setGroupName] = useState('')
  const [showFlashcards, setShowFlashcards] = useState(false)

  const fetchWords = useCallback(async () => {
    try {
      const response = await fetch(`/api/groups/${groupId}/words`)
      if (response.ok) {
        const data = await response.json()
        setWords(data)

        // Extract group name from first word if available
        if (data.length > 0) {
          // You could fetch group details separately, but for simplicity we'll use a default
          setGroupName('Study Group')
        }
      }
    } catch (error) {
      console.error('Error fetching words:', error)
    } finally {
      setLoading(false)
    }
  }, [groupId])

  useEffect(() => {
    if (groupId) {
      fetchWords()
    }
  }, [groupId, fetchWords])

  const handleRemoveWord = async (wordGroupId: string) => {
    if (!confirm('Are you sure you want to remove this word from the group?')) {
      return
    }

    try {
      const response = await fetch(`/api/groups/${groupId}/words`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wordGroupId,
        }),
      })

      if (response.ok) {
        fetchWords()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to remove word from group')
      }
    } catch (error) {
      console.error('Error removing word from group:', error)
      alert('Failed to remove word from group')
    }
  }

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading group words...</p>
        </div>
      </main>
    )
  }

  if (showFlashcards) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => setShowFlashcards(false)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Word List
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            Flashcards Study Mode
          </h1>
          <div></div>
        </div>
        <FlashcardViewer words={words} />
      </main>
    )
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.push('/groups')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Groups
        </Button>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {groupName}
            </h1>
            <p className="text-gray-600">
              {words.length} word{words.length !== 1 ? 's' : ''} in this group
            </p>
          </div>

          {words.length > 0 && (
            <Button
              onClick={() => setShowFlashcards(true)}
              size="lg"
              className="bg-green-600 hover:bg-green-700"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Start Flashcards
            </Button>
          )}
        </div>
      </div>

      {words.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No words in this group
            </h3>
            <p className="text-gray-600 mb-4">
              Search for words on the homepage and add them to this group
            </p>
            <Button onClick={() => router.push('/')}>
              Go to Word Search
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {words.map((word) => (
            <Card key={word.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-2xl text-gray-900">
                      {word.word}
                    </CardTitle>
                    <div className="flex items-center space-x-3 mt-2 text-sm text-gray-600">
                      {word.partOfSpeech && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {word.partOfSpeech}
                        </span>
                      )}
                      {word.phoneticUk && (
                        <span>UK: {word.phoneticUk}</span>
                      )}
                      {word.phoneticUs && (
                        <span>US: {word.phoneticUs}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <PronunciationButton
                      audioUrl={word.audioUk}
                      variant="uk"
                      title="Play UK pronunciation"
                    />
                    <PronunciationButton
                      audioUrl={word.audioUs}
                      variant="us"
                      title="Play US pronunciation"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">中文含义</h3>
                  <p className="text-gray-900">{word.meaningCn}</p>
                </div>

                {word.exampleSentence && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1">例句</h3>
                    <p className="text-gray-900 italic text-sm">"{word.exampleSentence}"</p>
                    {word.exampleTranslation && (
                      <p className="text-gray-600 text-xs mt-1">{word.exampleTranslation}</p>
                    )}
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveWord(word.wordGroupId)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}
