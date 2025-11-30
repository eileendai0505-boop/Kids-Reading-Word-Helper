import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = "nodejs";

export async function GET() {
  try {
    const groups = await prisma.group.findMany({
      include: {
        _count: {
          select: {
            wordGroups: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const formattedGroups = groups.map(group => ({
      ...group,
      wordCount: group._count.wordGroups
    }))

    return NextResponse.json(formattedGroups)
  } catch (error) {
    console.error('Error fetching groups:', error)
    return NextResponse.json(
      { error: 'Failed to fetch groups' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json()

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Group name is required' },
        { status: 400 }
      )
    }

    const existingGroup = await prisma.group.findUnique({
      where: { name: name.trim() }
    })

    if (existingGroup) {
      return NextResponse.json(
        { error: 'Group with this name already exists' },
        { status: 400 }
      )
    }

    const group = await prisma.group.create({
      data: {
        name: name.trim()
      }
    })

    return NextResponse.json(group)
  } catch (error) {
    console.error('Error creating group:', error)
    return NextResponse.json(
      { error: 'Failed to create group' },
      { status: 500 }
    )
  }
}
