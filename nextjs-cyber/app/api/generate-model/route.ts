import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// ===== CONFIGURATION =====
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY
const POLLINATIONS_API_URL = 'https://image.pollinations.ai/prompt'

// ===== HELPER: SLEEP =====
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ===== METHOD 1: GOOGLE IMAGEN (PRIMARY) =====
// Note: Google Imagen API is not available in the standard SDK
// Using Pollinations.ai as primary method instead
async function generateWithGoogleImagen(prompt: string, aspectRatio: string = '9:16'): Promise<string> {
  console.log('[Image Generation] Google Imagen not available in SDK, using fallback...')
  throw new Error('Google Imagen not available - will use fallback')
}

// ===== METHOD 2: POLLINATIONS.AI (FALLBACK - FREE, NO KEY) =====
async function generateWithPollinations(prompt: string): Promise<string> {
  console.log('[Pollinations.ai] Starting generation (fallback)...')
  
  try {
    // Pollinations.ai accepts prompt in URL, returns image directly
    const encodedPrompt = encodeURIComponent(prompt)
    const imageUrl = `${POLLINATIONS_API_URL}/${encodedPrompt}?width=768&height=1344&nologo=true&enhance=true`
    
    // Fetch image as buffer
    const response = await fetch(imageUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Pollinations API error: ${response.status}`)
    }
    
    // Convert to base64
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64 = buffer.toString('base64')
    
    console.log('[Pollinations.ai] Success! Size:', buffer.length, 'bytes')
    return `data:image/jpeg;base64,${base64}`
    
  } catch (error: any) {
    console.error('[Pollinations.ai Error]:', error.message)
    throw error
  }
}

// ===== MAIN API HANDLER =====
export async function POST(request: NextRequest) {
  try {
    // Parse request
    const { prompt, aspect_ratio = "9:16" } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      )
    }

    console.log('[Generate Model API] Request received:')
    console.log('  - Prompt:', prompt.substring(0, 100) + '...')
    console.log('  - Aspect Ratio:', aspect_ratio)

    let imageDataURL: string
    let source: string

    // Try Google Imagen first
    try {
      imageDataURL = await generateWithGoogleImagen(prompt, aspect_ratio)
      source = 'Google Imagen 3.0'
      console.log('[API] Using Google Imagen')
      
    } catch (googleError: any) {
      // Fallback to Pollinations.ai (free, no key required)
      console.log('[API] Google Imagen failed, using Pollinations.ai fallback...')
      imageDataURL = await generateWithPollinations(prompt)
      source = 'Pollinations.ai (Free Fallback)'
    }

    // Return success
    return NextResponse.json({
      success: true,
      imageUrl: imageDataURL,
      prompt: prompt,
      aspectRatio: aspect_ratio,
      source: source,
      note: 'Image generated successfully'
    })

  } catch (error: any) {
    console.error('[Generate Model API] Complete failure:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to generate image',
        message: 'Không thể tạo ảnh. Vui lòng thử lại sau.',
        details: error.toString()
      },
      { status: 500 }
    )
  }
}
