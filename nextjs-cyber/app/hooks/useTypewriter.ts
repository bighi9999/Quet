import { useState, useEffect, useRef } from 'react'

interface TypewriterOptions {
  text: string
  speed?: number
  onComplete?: () => void
  enabled?: boolean
}

export function useTypewriter({ 
  text, 
  speed = 20, 
  onComplete,
  enabled = true 
}: TypewriterOptions) {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const indexRef = useRef(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Reset when text changes
    indexRef.current = 0
    setDisplayedText('')
    
    if (!enabled || !text) {
      setDisplayedText(text)
      setIsTyping(false)
      return
    }

    setIsTyping(true)

    const typeNextChar = () => {
      if (indexRef.current < text.length) {
        setDisplayedText(text.substring(0, indexRef.current + 1))
        indexRef.current++
        timerRef.current = setTimeout(typeNextChar, speed)
      } else {
        setIsTyping(false)
        onComplete?.()
      }
    }

    // Start typing after a small delay
    timerRef.current = setTimeout(typeNextChar, 100)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [text, speed, enabled, onComplete])

  const skipTyping = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    setDisplayedText(text)
    setIsTyping(false)
    indexRef.current = text.length
  }

  return { displayedText, isTyping, skipTyping }
}
