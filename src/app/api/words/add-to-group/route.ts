import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { wordId, groupId } = await request.json()

    if (!wordId || !groupId) {
      return NextResponse.json(
        { error: 'Word ID and Group ID are required' },
        { status: 400 }
      )
    }

    // Check if word exists
    const word = await prisma.word.findUnique({
      where: { id: wordId }
    })

    if (!word) {
      return NextResponse.json(
        { error: 'Word not found' },
        { status: 404 }
      )
    }

    // Check if group exists
    const group = await prisma.group.findUnique({
      where: { id: groupId }
    })

    if (!group) {
      return NextResponse.json(
        { error: 'Group not found' },
        { status: 404 }
      )
    }

    // Check if word is already in the group
    const existingWordGroup = await prisma.wordGroup.findUnique({
      where: {
        wordId_groupId: {
          wordId,
          groupId
        }
      }
    })

    if (existingWordGroup) {
      return NextResponse.json(
        { error: 'Word is already in this group' },
        { status: 400 }
      )
    }

    // Add word to group
    const wordGroup = await prisma.wordGroup.create({
      data: {
        wordId,
        groupId
      },
      include: {
        word: true,
        group: true
      }
    })

    return NextResponse.json(wordGroup)
  } catch (error) {
    console.error('Error adding word to group:', error)
    return NextResponse.json(
      { error: 'Failed to add word to group' },
      { status: 500 }
    )
  }
}