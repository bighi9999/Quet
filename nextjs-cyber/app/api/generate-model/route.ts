import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI, ImageGenerateContentResponse } from '@google/generative-ai'

// ===== CONFIGURATION =====
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY
const POLLINATIONS_API_URL = 'https://image.pollinations.ai/prompt'

// ===== HELPER: SLEEP =====
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ===== METHOD 1: GOOGLE IMAGEN (PRIMARY) =====
async function generateWithGoogleImagen(prompt: string, aspectRatio: string = '9:16'): Promise<string> {
  console.log('[Google Imagen] Starting generation...')
  
  if (!GOOGLE_API_KEY) {
    throw new Error('Google API Key not configured')
  }

  try {
    const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY)
    
    // Try Imagen 3.0 first
    try {
      const model = genAI.getGenerativeModel({ model: 'imagen-3.0-generate-001' })
      
      // Map aspect ratio to Imagen dimensions
      let dimensions = { width: 1024, height: 1024 }
      if (aspectRatio === '9:16') dimensions = { width: 768, height: 1344 }
      else if (aspectRatio === '16:9') dimensions = { width: 1344, height: 768 }
      else if (aspectRatio === '1:1') dimensions = { width: 1024, height: 1024 }
      
      const result = await model.generateContent({
        prompt: prompt,
        numberOfImages: 1,
        ...dimensions
      }) as ImageGenerateContentResponse
      
      if (result.response && result.response.candidates && result.response.candidates[0]) {
        const imageData = result.response.candidates[0].content
        console.log('[Google Imagen] Success!')
        return `data:image/png;base64,${imageData}`
      }
      
      throw new Error('No image data returned from Imagen')
      
    } catch (imagenError: any) {
      // If Imagen not available, try Gemini with image generation capabilities
      console.log('[Google Imagen] Not available, trying Gemini fallback...')
      console.error('[Imagen Error]:', imagenError.message)
      
      // Fallback to text-based generation with Gemini
      throw new Error('Imagen not available for this API key')
    }
    
  } catch (error: any) {
    console.error('[Google AI Error]:', error.message)
    throw error
  }
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
