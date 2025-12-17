import { NextRequest, NextResponse } from 'next/server'

// Hugging Face Inference API Configuration
const HF_API_URL = 'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev'
const HF_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN

// Retry configuration for "Model is loading" errors
const MAX_RETRIES = 3
const RETRY_DELAY = 5000 // 5 seconds

/**
 * Sleep helper function
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Call Hugging Face Inference API with retry logic
 */
async function queryHuggingFace(prompt: string, retryCount = 0): Promise<Buffer> {
  console.log(`[HF API] Attempt ${retryCount + 1}/${MAX_RETRIES + 1} - Generating image...`)
  
  const response = await fetch(HF_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${HF_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        guidance_scale: 7.5,
        num_inference_steps: 50,
        width: 512,
        height: 768
      }
    })
  })

  // Check for "Model is loading" error
  if (response.status === 503) {
    const errorData = await response.json()
    console.log('[HF API] Model loading error:', errorData)
    
    if (errorData.error && errorData.error.includes('loading') && retryCount < MAX_RETRIES) {
      console.log(`[HF API] Model is loading. Retrying in ${RETRY_DELAY/1000}s...`)
      await sleep(RETRY_DELAY)
      return queryHuggingFace(prompt, retryCount + 1)
    }
    
    throw new Error(`Model is currently loading. Estimated time: ${errorData.estimated_time || 20}s. Please try again in a moment.`)
  }

  // Check for other errors
  if (!response.ok) {
    const errorText = await response.text()
    console.error('[HF API] Error response:', errorText)
    throw new Error(`Hugging Face API error: ${response.status} - ${errorText}`)
  }

  // Get image as buffer
  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  
  console.log(`[HF API] Success! Image size: ${buffer.length} bytes`)
  
  return buffer
}

/**
 * Convert Buffer to Base64 Data URL
 */
function bufferToBase64DataURL(buffer: Buffer, mimeType: string = 'image/jpeg'): string {
  const base64 = buffer.toString('base64')
  return `data:${mimeType};base64,${base64}`
}

/**
 * POST endpoint for AI model image generation
 */
export async function POST(request: NextRequest) {
  try {
    // Check if API token is configured
    if (!HF_API_TOKEN || HF_API_TOKEN === 'your_huggingface_token_here') {
      return NextResponse.json(
        {
          success: false,
          error: 'Hugging Face API token chưa được cấu hình',
          message: 'Vui lòng thêm HUGGINGFACE_API_TOKEN vào file .env.local'
        },
        { status: 500 }
      )
    }

    // Parse request body
    const { prompt, aspect_ratio = "9:16" } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Prompt is required' 
        },
        { status: 400 }
      )
    }

    console.log('[HF API] Received request:')
    console.log('  - Prompt:', prompt.substring(0, 100) + '...')
    console.log('  - Aspect Ratio:', aspect_ratio)

    // Call Hugging Face Inference API with retry
    const imageBuffer = await queryHuggingFace(prompt)

    // Convert buffer to base64 data URL
    const base64DataURL = bufferToBase64DataURL(imageBuffer, 'image/jpeg')

    console.log('[HF API] Image converted to base64 successfully')
    console.log('  - Data URL length:', base64DataURL.length, 'characters')

    // Return success response with base64 image
    return NextResponse.json({
      success: true,
      imageUrl: base64DataURL,
      prompt: prompt,
      aspectRatio: aspect_ratio,
      source: 'Hugging Face FLUX.1-dev',
      note: 'Image is base64-encoded for instant display'
    })

  } catch (error: any) {
    console.error('[HF API] Generation failed:', error)
    
    // Check if it's a model loading error
    if (error.message && error.message.includes('loading')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Model đang được tải lên',
          message: 'Mô hình AI đang khởi động. Vui lòng thử lại sau 20 giây.',
          estimatedWait: '20s'
        },
        { status: 503 }
      )
    }

    // Check if it's a token/billing error
    if (error.message && (error.message.includes('billing') || error.message.includes('credit') || error.message.includes('quota'))) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tài khoản Hugging Face đã vượt quota',
          message: 'Vui lòng kiểm tra quota tại https://huggingface.co/settings/billing'
        },
        { status: 402 }
      )
    }

    // Generic error
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to generate image',
        details: error.toString()
      },
      { status: 500 }
    )
  }
}
