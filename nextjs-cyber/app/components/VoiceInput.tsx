'use client'

import { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, Volume2 } from 'lucide-react'

interface VoiceInputProps {
  onTranscript: (text: string) => void
  language?: string
  placeholder?: string
  className?: string
}

export default function VoiceInput({ 
  onTranscript, 
  language = 'vi-VN',
  placeholder = 'Nhấp vào mic để nói...',
  className = ''
}: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [audioLevel, setAudioLevel] = useState(0)
  
  const recognitionRef = useRef<any>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number>()

  // ===== CHECK BROWSER SUPPORT =====
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      setIsSupported(!!SpeechRecognition)

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = language
        recognition.maxAlternatives = 1

        // Event handlers
        recognition.onresult = (event: any) => {
          let interimText = ''
          let finalText = ''

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            
            if (event.results[i].isFinal) {
              finalText += transcript + ' '
            } else {
              interimText += transcript
            }
          }

          if (finalText) {
            setTranscript(prev => {
              const newTranscript = (prev + ' ' + finalText).trim()
              onTranscript(newTranscript)
              return newTranscript
            })
          }

          setInterimTranscript(interimText)
        }

        recognition.onerror = (event: any) => {
          console.error('[VoiceInput] Recognition error:', event.error)
          
          if (event.error === 'no-speech') {
            console.log('[VoiceInput] No speech detected, continuing...')
          } else {
            setIsListening(false)
          }
        }

        recognition.onend = () => {
          if (isListening) {
            // Auto-restart if still listening
            try {
              recognition.start()
            } catch (error) {
              console.error('[VoiceInput] Failed to restart:', error)
              setIsListening(false)
            }
          }
        }

        recognitionRef.current = recognition
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [language, isListening, onTranscript])

  // ===== AUDIO VISUALIZATION =====
  const startAudioVisualization = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const audioContext = new AudioContext()
      const analyser = audioContext.createAnalyser()
      const source = audioContext.createMediaStreamSource(stream)
      
      analyser.fftSize = 256
      source.connect(analyser)
      
      audioContextRef.current = audioContext
      analyserRef.current = analyser

      const dataArray = new Uint8Array(analyser.frequencyBinCount)
      
      const updateLevel = () => {
        if (!isListening) return
        
        analyser.getByteFrequencyData(dataArray)
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length
        const level = Math.min(100, (average / 128) * 100)
        
        setAudioLevel(level)
        animationFrameRef.current = requestAnimationFrame(updateLevel)
      }
      
      updateLevel()
    } catch (error) {
      console.error('[VoiceInput] Microphone access denied:', error)
    }
  }

  // ===== START/STOP LISTENING =====
  const toggleListening = () => {
    if (!isSupported || !recognitionRef.current) {
      alert('Trình duyệt không hỗ trợ Web Speech API. Vui lòng dùng Chrome/Edge.')
      return
    }

    if (isListening) {
      // Stop listening
      recognitionRef.current.stop()
      setIsListening(false)
      setAudioLevel(0)
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    } else {
      // Start listening
      try {
        recognitionRef.current.start()
        setIsListening(true)
        setTranscript('')
        setInterimTranscript('')
        startAudioVisualization()
      } catch (error) {
        console.error('[VoiceInput] Failed to start:', error)
      }
    }
  }

  // ===== RENDER =====
  if (!isSupported) {
    return (
      <div className={`voice-input-unsupported ${className}`} style={{
        padding: '8px',
        borderRadius: '8px',
        background: 'rgba(255, 0, 0, 0.1)',
        color: '#ff4444',
        fontSize: '12px',
        textAlign: 'center'
      }}>
        ⚠️ Trình duyệt không hỗ trợ Voice Input
      </div>
    )
  }

  return (
    <div className={`voice-input-container ${className}`} style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px',
      background: isListening ? 'rgba(255, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.03)',
      borderRadius: '12px',
      border: `2px solid ${isListening ? '#ff4444' : 'rgba(255, 255, 255, 0.1)'}`,
      transition: 'all 0.3s ease'
    }}>
      {/* Microphone Button */}
      <button
        onClick={toggleListening}
        className="mic-button"
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: 'none',
          background: isListening 
            ? 'linear-gradient(135deg, #ff4444 0%, #cc0000 100%)' 
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          boxShadow: isListening 
            ? '0 0 20px rgba(255, 68, 68, 0.6)' 
            : '0 4px 15px rgba(102, 126, 234, 0.4)',
          animation: isListening ? 'pulse 1.5s ease-in-out infinite' : 'none'
        }}
      >
        {isListening ? <MicOff size={24} /> : <Mic size={24} />}
      </button>

      {/* Audio Visualization */}
      {isListening && (
        <div className="audio-wave" style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          height: '48px'
        }}>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="wave-bar"
              style={{
                width: '4px',
                height: `${20 + (audioLevel / 5) * (i + 1)}px`,
                background: 'linear-gradient(to top, #667eea, #764ba2)',
                borderRadius: '2px',
                transition: 'height 0.1s ease',
                animation: 'wave 1s ease-in-out infinite',
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Transcript Display */}
      <div className="transcript-display" style={{
        flex: 1,
        fontSize: '14px',
        color: isListening ? '#fff' : '#888'
      }}>
        {isListening ? (
          <>
            <div style={{ color: '#fff', fontWeight: '500' }}>
              {transcript || interimTranscript || 'Đang lắng nghe...'}
            </div>
            {interimTranscript && (
              <div style={{ color: '#888', fontSize: '12px', marginTop: '4px' }}>
                {interimTranscript}
              </div>
            )}
          </>
        ) : (
          <span>{placeholder}</span>
        )}
      </div>

      {/* Status Icon */}
      <div className="status-icon">
        {isListening ? (
          <Volume2 size={20} style={{ color: '#ff4444' }} />
        ) : (
          <Mic size={20} style={{ color: '#888' }} />
        )}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes wave {
          0%, 100% {
            transform: scaleY(0.5);
          }
          50% {
            transform: scaleY(1);
          }
        }
      `}</style>
    </div>
  )
}
