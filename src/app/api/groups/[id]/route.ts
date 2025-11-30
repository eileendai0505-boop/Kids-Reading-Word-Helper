export const dynamic = 'force-dynamic'
export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name } = await request.json()
    const { id } = params

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Group name is required' },
        { status: 400 }
      )
    }

    const existingGroup = await prisma.group.findUnique({
      where: { name: name.trim() }
    })

    if (existingGroup && existingGroup.id !== id) {
      return NextResponse.json(
        { error: 'Group with this name already exists' },
        { status: 400 }
      )
    }

    const group = await prisma.group.update({
      where: { id },
      data: {
        name: name.trim()
      }
    })

    return NextResponse.json(group)
  } catch (error) {
    console.error('Error updating group:', error)
    return NextResponse.json(
      { error: 'Failed to update group' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    await prisma.group.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Group deleted successfully' })
  } catch (error) {
    console.error('Error deleting group:', error)
    return NextResponse.json(
      { error: 'Failed to delete group' },
      { status: 500 }
    )
  }
}