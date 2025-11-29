import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const wordGroups = await prisma.wordGroup.findMany({
      where: { groupId: id },
      include: {
        word: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    const words = wordGroups.map(wg => ({
      ...wg.word,
      wordGroupId: wg.id,
      addedAt: wg.createdAt
    }))

    return NextResponse.json(words)
  } catch (error) {
    console.error('Error fetching group words:', error)
    return NextResponse.json(
      { error: 'Failed to fetch group words' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { wordGroupId } = await request.json()
    const { id } = params

    if (!wordGroupId) {
      return NextResponse.json(
        { error: 'Word Group ID is required' },
        { status: 400 }
      )
    }

    await prisma.wordGroup.delete({
      where: {
        id: wordGroupId,
        groupId: id // Ensure we're deleting from the correct group
      }
    })

    return NextResponse.json({ message: 'Word removed from group successfully' })
  } catch (error) {
    console.error('Error removing word from group:', error)
    return NextResponse.json(
      { error: 'Failed to remove word from group' },
      { status: 500 }
    )
  }
}