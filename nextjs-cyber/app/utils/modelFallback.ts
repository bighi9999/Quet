// Smart Fallback System for AI Models

export interface ModelConfig {
  id: string
  name: string
  provider: string
  priority: number
  timeout: number // milliseconds
}

export const MODEL_PRIORITY_LIST: ModelConfig[] = [
  { 
    id: 'gemini', 
    name: 'Gemini 2.5 Flash', 
    provider: 'Google',
    priority: 1,
    timeout: 10000 // 10 seconds
  },
  { 
    id: 'qwen2', 
    name: 'Qwen2-VL-7B', 
    provider: 'Alibaba',
    priority: 2,
    timeout: 10000
  },
  { 
    id: 'llama', 
    name: 'Llama 3.2 11B Vision', 
    provider: 'Meta',
    priority: 3,
    timeout: 10000
  }
]

export interface FallbackResult<T> {
  success: boolean
  data?: T
  error?: string
  modelUsed?: string
  attempts: number
  totalTime: number
}

export async function executeWithFallback<T>(
  requestFn: (modelId: string) => Promise<T>,
  modelIds?: string[]
): Promise<FallbackResult<T>> {
  const startTime = Date.now()
  const modelsToTry = modelIds && modelIds.length > 0 
    ? MODEL_PRIORITY_LIST.filter(m => modelIds.includes(m.id))
    : MODEL_PRIORITY_LIST

  let attempts = 0
  const errors: string[] = []

  for (const model of modelsToTry) {
    attempts++
    console.log(`[Fallback System] Attempt ${attempts}: Trying ${model.name}...`)

    try {
      // Create timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error(`Timeout after ${model.timeout}ms`)), model.timeout)
      })

      // Race between request and timeout
      const result = await Promise.race([
        requestFn(model.id),
        timeoutPromise
      ])

      const totalTime = Date.now() - startTime
      console.log(`[Fallback System] ✓ Success with ${model.name} in ${totalTime}ms`)

      return {
        success: true,
        data: result,
        modelUsed: model.name,
        attempts,
        totalTime
      }
    } catch (error: any) {
      const errorMsg = error?.message || String(error)
      console.error(`[Fallback System] ✗ ${model.name} failed:`, errorMsg)
      errors.push(`${model.name}: ${errorMsg}`)

      // Check if it's a retryable error
      const isRetryable = 
        errorMsg.includes('429') || // Rate limit
        errorMsg.includes('500') || // Server error
        errorMsg.includes('502') || // Bad gateway
        errorMsg.includes('503') || // Service unavailable
        errorMsg.includes('504') || // Gateway timeout
        errorMsg.includes('Timeout') ||
        errorMsg.includes('Network')

      if (!isRetryable && attempts < modelsToTry.length) {
        console.log(`[Fallback System] Non-retryable error, trying next model...`)
      }

      // Continue to next model
      continue
    }
  }

  // All models failed
  const totalTime = Date.now() - startTime
  console.error(`[Fallback System] ✗ All ${attempts} models failed after ${totalTime}ms`)

  return {
    success: false,
    error: `All models failed:\n${errors.join('\n')}`,
    attempts,
    totalTime
  }
}
