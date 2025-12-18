'use client'

import { useTypewriter } from '../hooks/useTypewriter'
import { useEffect, useRef, useState } from 'react'

interface TypewriterTextProps {
  text: string
  speed?: number
  className?: string
  enableSound?: boolean
  onComplete?: () => void
}

export default function TypewriterText({ 
  text, 
  speed = 20, 
  className = '',
  enableSound = false,
  onComplete 
}: TypewriterTextProps) {
  const { displayedText, isTyping, skipTyping } = useTypewriter({ 
    text, 
    speed, 
    onComplete,
    enabled: true 
  })
  
  const [soundEnabled, setSoundEnabled] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  const lastCharTimeRef = useRef<number>(0)

  // Initialize Web Audio API for typing sound
  useEffect(() => {
    if (typeof window !== 'undefined' && enableSound) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
        setSoundEnabled(true)
      } catch (error) {
        console.warn('Web Audio API not supported')
      }
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [enableSound])

  // Play typing sound effect
  useEffect(() => {
    if (!isTyping || !soundEnabled || !audioContextRef.current) return

    const now = Date.now()
    // Throttle sound to avoid too many plays
    if (now - lastCharTimeRef.current < speed) return

    lastCharTimeRef.current = now

    try {
      const context = audioContextRef.current
      const oscillator = context.createOscillator()
      const gainNode = context.createGain()

      // Create mechanical keyboard sound
      oscillator.type = 'square'
      oscillator.frequency.setValueAtTime(
        800 + Math.random() * 200, // Random pitch variation
        context.currentTime
      )

      // Very short, quiet click
      gainNode.gain.setValueAtTime(0.02, context.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(
        0.001, 
        context.currentTime + 0.02
      )

      oscillator.connect(gainNode)
      gainNode.connect(context.destination)

      oscillator.start(context.currentTime)
      oscillator.stop(context.currentTime + 0.02)
    } catch (error) {
      // Silently fail
    }
  }, [displayedText, isTyping, soundEnabled, speed])

  return (
    <div className="relative">
      <div className={className}>
        {displayedText}
        {isTyping && (
          <span className="inline-block w-2 h-4 ml-1 bg-cyber-primary animate-pulse" />
        )}
      </div>
      
      {isTyping && (
        <button
          onClick={skipTyping}
          className="absolute -right-12 top-0 text-xs text-cyber-secondary hover:text-cyber-primary transition-colors"
          title="Skip animation"
        >
          Skip ⏭
        </button>
      )}
    </div>
  )
}
