'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PronunciationButton } from './pronunciation-button'
import { ArrowLeft, ArrowRight, RotateCcw, CheckCircle, XCircle, Trophy } from 'lucide-react'

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

interface FlashcardSession {
  id: string
  groupId: string
  totalWords: number
  knownWords: number
  unknownWords: number
  createdAt: string
}

export function FlashcardViewer({ words }: { words: Word[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [knownWords, setKnownWords] = useState<Word[]>([])
  const [unknownWords, setUnknownWords] = useState<Word[]>([])
  const [reviewQueue, setReviewQueue] = useState<Word[]>(words)
  const [isComplete, setIsComplete] = useState(false)

  const currentWord = reviewQueue[0]

  const handleFlip = useCallback(() => {
    setIsFlipped(!isFlipped)
  }, [isFlipped])

  const handleKnown = useCallback(() => {
    const word = reviewQueue[0]
    setKnownWords(prev => [...prev, word])
    setReviewQueue(prev => prev.slice(1))
    setIsFlipped(false)
  }, [reviewQueue])

  const handleUnknown = useCallback(() => {
    const word = reviewQueue[0]
    // Add to the end of queue for spaced repetition
    setReviewQueue(prev => [...prev.slice(1), word])
    setIsFlipped(false)
  }, [reviewQueue])

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
      setIsFlipped(false)
    }
  }, [currentIndex])

  const handleNext = useCallback(() => {
    if (currentIndex < reviewQueue.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setIsFlipped(false)
    }
  }, [currentIndex, reviewQueue.length])

  // Check if session is complete
  useEffect(() => {
    if (reviewQueue.length === 0 && (knownWords.length > 0 || unknownWords.length > 0)) {
      setIsComplete(true)
      saveSession()
    }
  }, [reviewQueue.length, knownWords.length, unknownWords.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case ' ':
        case 'enter':
          event.preventDefault()
          handleFlip()
          break
        case 'arrowleft':
          event.preventDefault()
          handlePrevious()
          break
        case 'arrowright':
          event.preventDefault()
          handleNext()
          break
        case 'k':
          event.preventDefault()
          handleKnown()
          break
        case 'u':
          event.preventDefault()
          handleUnknown()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleFlip, handlePrevious, handleNext, handleKnown, handleUnknown])

  // Save session when complete
  const saveSession = async () => {
    try {
      const response = await fetch('/api/flashcards/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          totalWords: words.length,
          knownWords: knownWords.length,
          unknownWords: unknownWords.length,
        }),
      })
      // You could handle the response here if needed
    } catch (error) {
      console.error('Error saving session:', error)
    }
  }

  if (isComplete) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Study Session Complete!
          </h2>
        </div>

        <Card className="mb-6">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{words.length}</div>
                <div className="text-gray-600">Total Words</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{knownWords.length}</div>
                <div className="text-gray-600">Known</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{unknownWords.length}</div>
                <div className="text-gray-600">Need Practice</div>
              </div>
            </div>

            <div className="text-lg text-gray-700">
              Great job! You've completed your study session.
              {unknownWords.length > 0 && (
                <span className="block mt-2">
                  Consider reviewing the {unknownWords.length} words that need more practice.
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Button
            onClick={() => {
              setReviewQueue(unknownWords)
              setKnownWords([])
              setUnknownWords([])
              setCurrentIndex(0)
              setIsFlipped(false)
              setIsComplete(false)
            }}
            className="w-full"
            disabled={unknownWords.length === 0}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Review Unknown Words ({unknownWords.length})
          </Button>

          <Button
            onClick={() => {
              setReviewQueue(words)
              setKnownWords([])
              setUnknownWords([])
              setCurrentIndex(0)
              setIsFlipped(false)
              setIsComplete(false)
            }}
            variant="outline"
            className="w-full"
          >
            Start New Session
          </Button>
        </div>
      </div>
    )
  }

  if (!currentWord) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-600">No words to study</div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 text-center">
        <div className="text-sm text-gray-600">
          Progress: {knownWords.length + unknownWords.length} / {words.length} words reviewed
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((knownWords.length + unknownWords.length) / words.length) * 100}%`
            }}
          />
        </div>
      </div>

      <div className="flip-card mb-8">
        <div
          className={`flip-card-inner h-80 ${isFlipped ? 'flipped' : ''}`}
          onClick={handleFlip}
        >
          {/* Front of card */}
          <div className="flip-card-front">
            <Card className="h-full cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center h-full p-8">
                <div className="text-4xl font-bold text-gray-900 mb-4">
                  {currentWord.word}
                </div>

                <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                  {currentWord.partOfSpeech && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {currentWord.partOfSpeech}
                    </span>
                  )}
                  {currentWord.phoneticUk && (
                    <span>UK: {currentWord.phoneticUk}</span>
                  )}
                  {currentWord.phoneticUs && (
                    <span>US: {currentWord.phoneticUs}</span>
                  )}
                </div>

                <div className="flex space-x-2">
                  <PronunciationButton
                    audioUrl={currentWord.audioUk}
                    variant="uk"
                    title="Play UK pronunciation"
                  />
                  <PronunciationButton
                    audioUrl={currentWord.audioUs}
                    variant="us"
                    title="Play US pronunciation"
                  />
                </div>

                <div className="mt-4 text-sm text-gray-500">
                  Click card to flip
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Back of card */}
          <div className="flip-card-back">
            <Card className="h-full cursor-pointer">
              <CardContent className="flex flex-col justify-center h-full p-8">
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-700 mb-2">中文含义</h3>
                  <p className="text-xl text-gray-900">{currentWord.meaningCn}</p>
                </div>

                {currentWord.exampleSentence && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">例句</h3>
                    <p className="text-gray-900 italic">"{currentWord.exampleSentence}"</p>
                    {currentWord.exampleTranslation && (
                      <p className="text-gray-600 text-sm mt-1">{currentWord.exampleTranslation}</p>
                    )}
                  </div>
                )}

                <div className="mt-4 text-sm text-gray-500">
                  Click card to flip back
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Navigation and Learning Buttons */}
      <div className="space-y-4">
        <div className="flex justify-center space-x-4">
          <Button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            variant="outline"
            size="lg"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <Button
            onClick={handleKnown}
            size="lg"
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            I know it
          </Button>

          <Button
            onClick={handleUnknown}
            size="lg"
            className="bg-orange-600 hover:bg-orange-700"
          >
            <XCircle className="h-4 w-4 mr-2" />
            I need practice
          </Button>

          <Button
            onClick={handleNext}
            disabled={currentIndex === reviewQueue.length - 1}
            variant="outline"
            size="lg"
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Keyboard hints */}
        <div className="text-center text-sm text-gray-500">
          <div>Space/Click to flip • ← → to navigate</div>
          <div>K - I know it • U - Need practice</div>
        </div>
      </div>

      {/* Keyboard navigation */}
      <div className="sr-only" aria-live="polite">
        Current word: {currentWord.word} • {isFlipped ? currentWord.meaningCn : 'Click to reveal meaning'}
      </div>
    </div>
  )
}