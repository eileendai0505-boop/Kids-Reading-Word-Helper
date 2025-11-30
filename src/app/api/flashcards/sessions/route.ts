export const dynamic = 'force-dynamic'
export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { groupId, totalWords, knownWords, unknownWords } = await request.json()

    const session = await prisma.flashcardSession.create({
      data: {
        groupId: groupId || 'default',
        totalWords,
        knownWords,
        unknownWords,
      }
    })

    return NextResponse.json(session)
  } catch (error) {
    console.error('Error saving flashcard session:', error)
    return NextResponse.json(
      { error: 'Failed to save session' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const sessions = await prisma.flashcardSession.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })

    return NextResponse.json(sessions)
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    )
  }
}
