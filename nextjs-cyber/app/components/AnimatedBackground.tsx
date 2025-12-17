'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

/**
 * CYBERPUNK ANIMATED BACKGROUND COMPONENT
 * 
 * Layer 1: Gradient Orbs (Slow-moving colored gradient blobs)
 * Layer 2: Data Stream (Flowing text lines simulating AI processing)
 * 
 * Performance: 60fps with GPU acceleration
 * Style: Non-distracting, ambient, modern cyberpunk aesthetic
 */
export default function AnimatedBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div 
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: -1 }}
    >
      {/* Layer 1: GRADIENT ORBS (Deep background) */}
      <div className="absolute inset-0">
        {/* Orb 1: Blue-Cyan */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0, 255, 255, 0.4) 0%, rgba(0, 100, 255, 0.2) 50%, transparent 100%)',
            filter: 'blur(100px)',
            opacity: 0.3,
          }}
          animate={{
            x: ['-20%', '40%', '-20%'],
            y: ['10%', '60%', '10%'],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Orb 2: Green-Emerald */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0, 255, 100, 0.35) 0%, rgba(0, 200, 150, 0.18) 50%, transparent 100%)',
            filter: 'blur(100px)',
            opacity: 0.3,
            top: '20%',
            right: '10%',
          }}
          animate={{
            x: ['10%', '-30%', '10%'],
            y: ['-10%', '40%', '-10%'],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />

        {/* Orb 3: Purple-Magenta */}
        <motion.div
          className="absolute w-[550px] h-[550px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(200, 0, 255, 0.35) 0%, rgba(100, 0, 200, 0.18) 50%, transparent 100%)',
            filter: 'blur(100px)',
            opacity: 0.3,
            bottom: '15%',
            left: '30%',
          }}
          animate={{
            x: ['0%', '-40%', '0%'],
            y: ['0%', '-30%', '0%'],
            scale: [1, 1.25, 1],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 5,
          }}
        />
      </div>

      {/* Layer 2: DATA STREAM LINES (Foreground, very subtle) */}
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '14px',
          lineHeight: '2',
        }}
      >
        {/* Data Stream Line 1 */}
        <motion.div
          className="absolute whitespace-nowrap text-cyan-400"
          style={{
            top: '15%',
            opacity: 0.08,
            fontWeight: 300,
          }}
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          AI_ANALYSIS &gt; DATA_FLOW &gt; NEURAL_NETWORK &gt; PROCESSING &gt; 01101001 &gt; SYSTEM_ACTIVE &gt; ANALYZING...
        </motion.div>

        {/* Data Stream Line 2 */}
        <motion.div
          className="absolute whitespace-nowrap text-green-400"
          style={{
            top: '35%',
            opacity: 0.06,
            fontWeight: 300,
          }}
          animate={{
            x: ['100%', '-100%'],
          }}
          transition={{
            duration: 42,
            repeat: Infinity,
            ease: 'linear',
            delay: 3,
          }}
        >
          MACHINE_LEARNING &gt; IMAGE_RECOGNITION &gt; DEEP_LEARNING &gt; 11010110 &gt; FLUX_MODEL &gt; GENERATION...
        </motion.div>

        {/* Data Stream Line 3 */}
        <motion.div
          className="absolute whitespace-nowrap text-purple-400"
          style={{
            top: '55%',
            opacity: 0.07,
            fontWeight: 300,
          }}
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 38,
            repeat: Infinity,
            ease: 'linear',
            delay: 7,
          }}
        >
          HUGGING_FACE &gt; AI_STUDIO &gt; REPLICATE &gt; GEMINI &gt; 10110011 &gt; API_CONNECTED &gt; READY...
        </motion.div>

        {/* Data Stream Line 4 */}
        <motion.div
          className="absolute whitespace-nowrap text-blue-400"
          style={{
            top: '75%',
            opacity: 0.05,
            fontWeight: 300,
          }}
          animate={{
            x: ['100%', '-100%'],
          }}
          transition={{
            duration: 45,
            repeat: Infinity,
            ease: 'linear',
            delay: 10,
          }}
        >
          VECTOR_SPACE &gt; EMBEDDING &gt; TRANSFORMER &gt; 01010101 &gt; TOKEN_STREAM &gt; CYBERPUNK_MODE &gt; ACTIVE...
        </motion.div>

        {/* Data Stream Line 5 */}
        <motion.div
          className="absolute whitespace-nowrap text-cyan-300"
          style={{
            top: '90%',
            opacity: 0.08,
            fontWeight: 300,
          }}
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: 'linear',
            delay: 15,
          }}
        >
          BG_AI_TOOLS &gt; VERSION_2.5.0 &gt; MOCHIPHOTO &gt; 11001010 &gt; INFERENCE &gt; RENDER &gt; COMPLETE...
        </motion.div>
      </div>

      {/* Optional: Subtle vignette overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.4) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
