import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface DictionaryResponse {
  word: string
  phonetic?: string
  phonetics: Array<{
    text?: string
    audio?: string
  }>
  meanings: Array<{
    partOfSpeech: string
    definitions: Array<{
      definition: string
      example?: string
    }>
  }>
}

async function searchDictionary(word: string): Promise<DictionaryResponse> {
  const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)

  if (!response.ok) {
    throw new Error('Word not found in dictionary')
  }

  const data: DictionaryResponse[] = await response.json()
  return data[0]
}

function extractPhonetics(data: DictionaryResponse) {
  const phonetics = data.phonetics || []
  let phoneticUk = ''
  let phoneticUs = ''
  let audioUk = ''
  let audioUs = ''

  for (const phonetic of phonetics) {
    if (phonetic.text) {
      if (phonetic.text.includes('UK')) {
        phoneticUk = phonetic.text
      } else if (phonetic.text.includes('US')) {
        phoneticUs = phonetic.text
      } else if (!phoneticUk) {
        phoneticUk = phonetic.text
      }
    }

    if (phonetic.audio) {
      if (phonetic.audio.includes('uk')) {
        audioUk = phonetic.audio
      } else if (phonetic.audio.includes('us')) {
        audioUs = phonetic.audio
      }
    }
  }

  return { phoneticUk, phoneticUs, audioUk, audioUs }
}

function extractMeaningAndExample(data: DictionaryResponse) {
  const firstMeaning = data.meanings[0]
  if (!firstMeaning) {
    return { meaningCn: '', exampleSentence: '', partOfSpeech: '' }
  }

  const definition = firstMeaning.definitions[0]
  const partOfSpeech = firstMeaning.partOfSpeech
  const meaningCn = definition.definition.substring(0, 100) // Use first definition as "meaning"
  const exampleSentence = definition.example || ''

  return { meaningCn, exampleSentence, partOfSpeech }
}

async function generateExampleFallback(word: string): Promise<string> {
  // Simple fallback - create a basic sentence with the word
  const templates = [
    `The ${word} is very interesting.`,
    `I like to ${word} every day.`,
    `She can ${word} very well.`,
    `They are ${word} right now.`,
    `We need to ${word} this book.`
  ]

  return templates[Math.floor(Math.random() * templates.length)]
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const word = searchParams.get('q')

    if (!word) {
      return NextResponse.json({ error: 'Word parameter is required' }, { status: 400 })
    }

    // First check if word exists in database
    const existingWord = await prisma.word.findUnique({
      where: { word: word.toLowerCase() }
    })

    if (existingWord) {
      return NextResponse.json(existingWord)
    }

    // Search in dictionary API
    const dictionaryData = await searchDictionary(word.toLowerCase())
    const { phoneticUk, phoneticUs, audioUk, audioUs } = extractPhonetics(dictionaryData)
    const { meaningCn, exampleSentence: example, partOfSpeech } = extractMeaningAndExample(dictionaryData)

    // If no example sentence from API, generate a fallback
    const exampleSentence = example || await generateExampleFallback(word.toLowerCase())

    // Create example translation (simple approach)
    const exampleTranslation = exampleSentence.includes(word.toLowerCase())
      ? exampleSentence.replace(word.toLowerCase(), `[${word}]`)
      : exampleSentence

    // Save to database
    const savedWord = await prisma.word.create({
      data: {
        word: word.toLowerCase(),
        meaningCn: meaningCn || `Definition of ${word}`,
        phoneticUk,
        phoneticUs,
        audioUk,
        audioUs,
        exampleSentence,
        exampleTranslation,
        partOfSpeech
      }
    })

    return NextResponse.json(savedWord)
  } catch (error) {
    console.error('Error searching word:', error)
    return NextResponse.json(
      { error: 'Failed to search word' },
      { status: 500 }
    )
  }
}