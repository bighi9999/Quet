import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// ===== CONFIGURATION =====
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY

// ===== PROMPT FOR REVERSE ENGINEERING =====
const REVERSE_PROMPT_SYSTEM = `You are an expert at creating detailed Stable Diffusion / Flux prompts from images.

Analyze this image carefully and generate a comprehensive, professional prompt that could recreate a similar image.

REQUIREMENTS:
1. Start with the main subject
2. Include detailed descriptions of:
   - Subject appearance (clothing, pose, expression)
   - Environment and background
   - Lighting and atmosphere
   - Art style and quality descriptors
   - Camera angle and composition
3. Use professional photography/AI art terminology
4. Keep it concise but detailed (50-150 words)
5. Write in English only
6. Format as a comma-separated prompt

EXAMPLE OUTPUT FORMAT:
"professional product photography, [main subject], [details], [environment], [lighting], [style], high quality, detailed, 8k resolution"

Analyze the image and generate the prompt:`

// ===== IMAGE TO PROMPT =====
async function imageToPrompt(imageBase64: string): Promise<string> {
  if (!GOOGLE_API_KEY) {
    throw new Error('Google API Key not configured')
  }

  const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY)
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.5-flash'
  })

  console.log('[Image-to-Prompt] Analyzing image...')

  const imagePart = {
    inlineData: {
      data: imageBase64.split(',')[1] || imageBase64,
      mimeType: 'image/jpeg'
    }
  }

  const result = await model.generateContent([
    REVERSE_PROMPT_SYSTEM,
    imagePart
  ])

  const response = result.response.text()
  
  // Clean up the response (remove quotes, extra whitespace)
  const cleanedPrompt = response
    .replace(/^["']|["']$/g, '')
    .replace(/\n+/g, ' ')
    .trim()

  console.log('[Image-to-Prompt] Generated prompt:', cleanedPrompt)

  return cleanedPrompt
}

// ===== ALTERNATIVE: CLIP INTERROGATOR (IF NEEDED) =====
async function clipInterrogator(imageBase64: string): Promise<string> {
  const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN
  
  if (!HUGGINGFACE_API_TOKEN) {
    throw new Error('Hugging Face API token not configured')
  }

  const endpoint = 'https://api-inference.huggingface.co/models/pharmapsychotic/clip-interrogator'
  
  const base64Data = imageBase64.split(',')[1] || imageBase64
  
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
    throw new Error(`CLIP Interrogator failed: ${response.status}`)
  }

  const result = await response.json()
  return result.caption || result[0]?.generated_text || 'No prompt generated'
}

// ===== MAIN API HANDLER =====
export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const { imageBase64, method = 'gemini' } = await request.json()

    if (!imageBase64) {
      return NextResponse.json(
        { success: false, error: 'Image is required' },
        { status: 400 }
      )
    }

    console.log('[Image-to-Prompt API] Starting analysis...')

    let prompt: string

    if (method === 'clip') {
      // Try CLIP Interrogator first
      try {
        prompt = await clipInterrogator(imageBase64)
      } catch (error) {
        console.warn('[Image-to-Prompt] CLIP failed, falling back to Gemini...')
        prompt = await imageToPrompt(imageBase64)
      }
    } else {
      // Use Gemini Vision (default)
      prompt = await imageToPrompt(imageBase64)
    }

    const processingTime = ((Date.now() - startTime) / 1000).toFixed(2)

    // Generate variations
    const variations = generatePromptVariations(prompt)

    return NextResponse.json({
      success: true,
      prompt: prompt,
      variations: variations,
      method: method,
      processing_time: processingTime + 's',
      character_count: prompt.length,
      word_count: prompt.split(/\s+/).length
    })

  } catch (error: any) {
    console.error('[Image-to-Prompt API] Error:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to generate prompt',
      processing_time: ((Date.now() - startTime) / 1000).toFixed(2) + 's'
    }, { status: 500 })
  }
}

// ===== HELPER: GENERATE VARIATIONS =====
function generatePromptVariations(basePrompt: string): string[] {
  const variations = [
    basePrompt, // Original
    `${basePrompt}, cinematic lighting, highly detailed`,
    `${basePrompt}, studio lighting, professional photography`,
    `${basePrompt}, dramatic lighting, artistic composition`,
    `${basePrompt}, soft natural lighting, lifestyle photography`
  ]

  return variations.slice(0, 4) // Return max 4 variations
}
