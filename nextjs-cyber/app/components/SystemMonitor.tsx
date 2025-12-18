'use client'

import { useState, useEffect } from 'react'
import { Activity, Zap, AlertCircle } from 'lucide-react'

interface APIStatus {
  name: string
  status: 'online' | 'slow' | 'offline'
  latency: number
  lastCheck: number
}

export default function SystemMonitor() {
  const [apiStatuses, setApiStatuses] = useState<APIStatus[]>([
    { name: 'Gemini', status: 'online', latency: 0, lastCheck: 0 },
    { name: 'HuggingFace', status: 'online', latency: 0, lastCheck: 0 },
    { name: 'Image Gen', status: 'online', latency: 0, lastCheck: 0 }
  ])

  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const checkAPIs = async () => {
      const results = await Promise.allSettled([
        checkAPI('https://generativelanguage.googleapis.com', 'Gemini'),
        checkAPI('https://router.huggingface.co', 'HuggingFace'),
        checkAPI('https://image.pollinations.ai', 'Image Gen')
      ])

      setApiStatuses(results.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value
        }
        return apiStatuses[index]
      }))
    }

    checkAPIs()
    const interval = setInterval(checkAPIs, 30000) // Check every 30s

    return () => clearInterval(interval)
  }, [])

  async function checkAPI(url: string, name: string): Promise<APIStatus> {
    const startTime = Date.now()
    
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 5000)

      await fetch(url, { 
        method: 'HEAD',
        signal: controller.signal,
        cache: 'no-store'
      })
      
      clearTimeout(timeout)
      const latency = Date.now() - startTime

      return {
        name,
        status: latency < 1000 ? 'online' : 'slow',
        latency,
        lastCheck: Date.now()
      }
    } catch (error) {
      return {
        name,
        status: 'offline',
        latency: Date.now() - startTime,
        lastCheck: Date.now()
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-400'
      case 'slow': return 'text-yellow-400'
      case 'offline': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return '🟢'
      case 'slow': return '🟡'
      case 'offline': return '🔴'
      default: return '⚪'
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div 
        className="bg-black/80 border border-cyber-primary rounded-lg p-3 backdrop-blur-md cursor-pointer hover:bg-black/90 transition-all"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyber-primary animate-pulse" />
          <span className="text-xs text-cyber-secondary font-mono">SYSTEM</span>
          <Zap className="w-3 h-3 text-yellow-400" />
        </div>

        {showDetails && (
          <div className="mt-3 space-y-2 min-w-[200px]">
            {apiStatuses.map((api) => (
              <div key={api.name} className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span>{getStatusIcon(api.status)}</span>
                  <span className="text-cyber-primary">{api.name}</span>
                </div>
                <span className={getStatusColor(api.status)}>
                  {api.status === 'offline' ? 'OFFLINE' : `${api.latency}ms`}
                </span>
              </div>
            ))}
            
            <div className="pt-2 border-t border-cyber-primary/30">
              <div className="text-[10px] text-cyber-secondary">
                Last check: {new Date(Math.max(...apiStatuses.map(a => a.lastCheck))).toLocaleTimeString()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
