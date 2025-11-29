'use client'

import { Button } from '@/components/ui/button'
import { Volume2 } from 'lucide-react'

interface PronunciationButtonProps {
  audioUrl?: string
  variant?: 'uk' | 'us'
  className?: string
}

export function PronunciationButton({
  audioUrl,
  variant = 'us',
  className = ""
}: PronunciationButtonProps) {
  const handlePlayAudio = () => {
    if (!audioUrl) return

    try {
      const audio = new Audio(audioUrl)
      audio.play().catch(error => {
        console.error('Error playing audio:', error)
      })
    } catch (error) {
      console.error('Error creating audio:', error)
    }
  }

  if (!audioUrl) {
    return (
      <Button
        variant="outline"
        size="icon"
        className={className}
        disabled
      >
        <Volume2 className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handlePlayAudio}
      className={className}
      title={`Play ${variant.toUpperCase()} pronunciation`}
    >
      <Volume2 className="h-4 w-4" />
    </Button>
  )
}