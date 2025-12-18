import { NextRequest, NextResponse } from 'next/server'

// ===== CONFIGURATION =====
const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN || process.env.HF_API_TOKEN
const UPSCALE_MODELS = {
  'real-esrgan': 'https://api-inference.huggingface.co/models/ai-forever/Real-ESRGAN',
  'swinir': 'https://api-inference.huggingface.co/models/caidas/swin2SR-classical-sr-x2-64'
}

// ===== HELPER: RETRY WITH BACKOFF =====
async function retryWithBackoff(fn: () => Promise<any>, maxRetries = 3, delay = 2000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error: any) {
      if (i === maxRetries - 1) throw error
      
      // Check if it's a model loading error
      if (error.message?.includes('loading') || error.message?.includes('503')) {
        console.log(`[Upscale] Model loading, retry ${i + 1}/${maxRetries} in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
        delay *= 2 // Exponential backoff
      } else {
        throw error
      }
    }
  }
}

// ===== UPSCALE IMAGE =====
async function upscaleImage(imageBase64: string, model: keyof typeof UPSCALE_MODELS = 'swinir'): Promise<Blob> {
  if (!HUGGINGFACE_API_TOKEN) {
    throw new Error('Hugging Face API token not configured')
  }

  const endpoint = UPSCALE_MODELS[model]
  
  // Convert base64 to blob
  const base64Data = imageBase64.split(',')[1] || imageBase64
  const binaryData = Buffer.from(base64Data, 'base64')

  console.log('[Upscale] Sending request to:', endpoint)
  console.log('[Upscale] Image size:', (binaryData.length / 1024).toFixed(2), 'KB')

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${HUGGINGFACE_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      inputs: base64Data,
      options: {
        wait_for_model: true
      }
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('[Upscale] Error response:', errorText)
    throw new Error(`Upscale failed: ${response.status} - ${errorText}`)
  }

  const blob = await response.blob()
  console.log('[Upscale] Success! Output size:', (blob.size / 1024).toFixed(2), 'KB')
  
  return blob
}

// ===== MAIN API HANDLER =====
export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const { imageBase64, model = 'swinir' } = await request.json()

    if (!imageBase64) {
      return NextResponse.json(
        { success: false, error: 'Image is required' },
        { status: 400 }
      )
    }

    console.log('[Upscale API] Starting upscale process...')

    // Upscale with retry logic
    const upscaledBlob = await retryWithBackoff(
      () => upscaleImage(imageBase64, model as keyof typeof UPSCALE_MODELS)
    )

    // Convert blob to base64
    const arrayBuffer = await upscaledBlob.arrayBuffer()
    const base64Image = Buffer.from(arrayBuffer).toString('base64')
    const dataUrl = `data:${upscaledBlob.type};base64,${base64Image}`

    const processingTime = ((Date.now() - startTime) / 1000).toFixed(2)

    return NextResponse.json({
      success: true,
      image: dataUrl,
      model: model,
      processing_time: processingTime + 's',
      original_size: imageBase64.length,
      upscaled_size: base64Image.length,
      size_increase: ((base64Image.length / imageBase64.length) * 100).toFixed(1) + '%'
    })

  } catch (error: any) {
    console.error('[Upscale API] Error:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Upscale failed',
      processing_time: ((Date.now() - startTime) / 1000).toFixed(2) + 's'
    }, { status: 500 })
  }
}
