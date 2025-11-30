'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PronunciationButton } from './pronunciation-button'
import { Plus } from 'lucide-react'

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

interface WordResultProps {
  word: Word
  onWordUpdated?: (word: Word) => void
}

export function WordResult({ word, onWordUpdated }: WordResultProps) {
  const [showGroupSelector, setShowGroupSelector] = useState(false)
  const [groups, setGroups] = useState<Array<{ id: string; name: string; wordCount: number }>>([])

  const fetchGroups = async () => {
    try {
      const response = await fetch('/api/groups')
      if (response.ok) {
        const data = await response.json()
        setGroups(data)
      }
    } catch (error) {
      console.error('Error fetching groups:', error)
    }
  }

  useEffect(() => {
    fetchGroups()
  }, [])

  const handleAddToGroup = async (groupId: string) => {
    try {
      const response = await fetch('/api/words/add-to-group', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wordId: word.id,
          groupId,
        }),
      })

      if (response.ok) {
        setShowGroupSelector(false)
        fetchGroups() // Refresh groups to update word counts
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to add word to group')
      }
    } catch (error) {
      console.error('Error adding word to group:', error)
      alert('Failed to add word to group')
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
              {word.word}
            </CardTitle>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              {word.partOfSpeech && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {word.partOfSpeech}
                </span>
              )}
              {word.phoneticUk && (
                <span>
                  <span className="font-medium">UK:</span> {word.phoneticUk}
                </span>
              )}
              {word.phoneticUs && (
                <span>
                  <span className="font-medium">US:</span> {word.phoneticUs}
                </span>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
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
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">中文含义</h3>
          <p className="text-gray-900 text-lg">{word.meaningCn}</p>
        </div>

        {word.exampleSentence && (
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">例句</h3>
            <p className="text-gray-900 italic">{"\""}{word.exampleSentence}{"\""}</p>
            {word.exampleTranslation && (
              <p className="text-gray-600 text-sm mt-1">{word.exampleTranslation}</p>
            )}
          </div>
        )}

        <div className="pt-4 border-t">
          <Button
            onClick={() => setShowGroupSelector(!showGroupSelector)}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add to Group
          </Button>
        </div>

        {showGroupSelector && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-3">Select a group:</h4>
            {groups.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No groups available. Create your first group in the Groups page.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {groups.map((group) => (
                  <Button
                    key={group.id}
                    variant="outline"
                    onClick={() => handleAddToGroup(group.id)}
                    className="justify-start h-auto p-3 text-left"
                  >
                    <div>
                      <div className="font-medium">{group.name}</div>
                      <div className="text-xs text-gray-500">
                        {group.wordCount} word{group.wordCount !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
