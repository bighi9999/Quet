import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// ===== MODEL CONFIGURATION =====
const AVAILABLE_MODELS = {
  gemini: {
    id: 'gemini',
    name: 'Gemini 2.5 Flash',
    provider: 'Google',
    type: 'api',
    apiKey: process.env.GOOGLE_API_KEY,
    endpoint: null // Uses SDK
  },
  qwen2: {
    id: 'qwen2',
    name: 'Qwen2-VL-7B',
    provider: 'Alibaba',
    type: 'huggingface',
    endpoint: 'https://router.huggingface.co/models/Qwen/Qwen2-VL-7B-Instruct',
    token: process.env.HUGGINGFACE_API_TOKEN
  },
  llama: {
    id: 'llama',
    name: 'Llama 3.2 11B Vision',
    provider: 'Meta',
    type: 'huggingface',
    endpoint: 'https://router.huggingface.co/models/meta-llama/Llama-3.2-11B-Vision-Instruct',
    token: process.env.HUGGINGFACE_API_TOKEN
  },
  pixtral: {
    id: 'pixtral',
    name: 'Pixtral 12B',
    provider: 'Mistral AI',
    type: 'huggingface',
    endpoint: 'https://router.huggingface.co/models/mistralai/Pixtral-12B-2409',
    token: process.env.HUGGINGFACE_API_TOKEN
  },
  molmo: {
    id: 'molmo',
    name: 'Molmo 7B',
    provider: 'Allen AI',
    type: 'huggingface',
    endpoint: 'https://router.huggingface.co/models/allenai/Molmo-7B-D-0924',
    token: process.env.HUGGINGFACE_API_TOKEN
  },
  phi: {
    id: 'phi',
    name: 'Phi-3.5 Vision',
    provider: 'Microsoft',
    type: 'huggingface',
    endpoint: 'https://router.huggingface.co/models/microsoft/Phi-3.5-vision-instruct',
    token: process.env.HUGGINGFACE_API_TOKEN
  },
  yi: {
    id: 'yi',
    name: 'Yi-VL-34B',
    provider: '01.AI',
    type: 'huggingface',
    endpoint: 'https://router.huggingface.co/models/01-ai/Yi-VL-34B',
    token: process.env.HUGGINGFACE_API_TOKEN
  }
}

// ===== SYSTEM PROMPT TEMPLATE =====
const SYSTEM_PROMPT = (productName?: string) => `You are an expert E-commerce Content Strategist and Product Analyst. Analyze this product image and generate comprehensive marketing content in Vietnamese.

${productName ? `PRODUCT NAME PROVIDED BY USER: "${productName}"` : 'PRODUCT NAME: Auto-detect from image'}

YOUR TASK:
1. Analyze the image thoroughly
2. Generate engaging, emotional, and persuasive marketing content
3. Return STRICTLY VALID JSON (no markdown, no code blocks)

REQUIRED JSON STRUCTURE:
{
  "technical_analysis": {
    "product_type": "Fashion Item | Electronics | Cosmetics | Food | Other",
    "product_name_guess": "${productName || 'Auto-detected name'}",
    "key_features": ["Feature 1", "Feature 2", "Feature 3"],
    "colors": ["#HEX1", "#HEX2", "#HEX3"],
    "visual_style": "Modern, Elegant, Professional...",
    "target_audience": "Gen Z | Adults 25-35 | Professionals..."
  },
  "ai_prompts": {
    "positive": "Detailed AI generation prompt for creating similar products...",
    "negative": "low quality, blurry, distorted..."
  },
  "marketing_content": {
    "product_name_final": "${productName || 'Tên sản phẩm được AI phát hiện'}",
    "sales_copy": {
      "shopee": "Bài đăng SEO chuẩn sàn TMĐT với emoji, bullet points, call-to-action mạnh...",
      "facebook_story": "Bài viết dạng storytelling, chia sẻ trải nghiệm cá nhân, cảm xúc chân thật, ngôn ngữ Gen Z...",
      "instagram_minimal": "Caption ngắn gọn, aesthetic, lifestyle-focused, hashtags tiếng Anh..."
    },
    "video_script": {
      "title": "Tiêu đề video TikTok/Reels hấp dẫn (VD: Sự thật về...)",
      "script": [
        { "scene": "Cảnh 1: Giới thiệu sản phẩm", "audio": "Mọi người ơi, hôm nay mình sẽ..." },
        { "scene": "Cảnh 2: Demo/Cận cảnh", "audio": "Nhìn chất liệu này xem..." },
        { "scene": "Cảnh 3: Kết luận", "audio": "Mình chấm 9/10 nhé..." }
      ]
    },
    "hooks_and_headlines": {
      "catchy_titles": [
        "Tiêu đề quảng cáo giật gân 1",
        "Tiêu đề quảng cáo giật gân 2",
        "Tiêu đề quảng cáo giật gân 3",
        "Tiêu đề quảng cáo giật gân 4",
        "Tiêu đề quảng cáo giật gán 5"
      ],
      "engaging_hooks": [
        "Câu mở đầu giữ chân người xem 1",
        "Câu mở đầu giữ chân người xem 2",
        "Câu mở đầu giữ chân người xem 3"
      ]
    }
  },
  "metadata": {
    "confidence": 95.5,
    "processing_time": "1.2s",
    "is_fashion": true
  }
}

RULES:
- All marketing content MUST be in Vietnamese
- Use emojis strategically for engagement
- Be persuasive, emotional, and authentic
- Adapt tone for each platform (Shopee=sales-focused, Facebook=storytelling, Instagram=aesthetic)
- Return ONLY raw JSON, no markdown formatting
`

// ===== QUERY GEMINI MODEL =====
async function queryGemini(imageBase64: string, productName?: string): Promise<any> {
  try {
    if (!AVAILABLE_MODELS.gemini.apiKey) {
      throw new Error('Google API Key not configured')
    }

    const genAI = new GoogleGenerativeAI(AVAILABLE_MODELS.gemini.apiKey)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json'
      }
    })

    const prompt = SYSTEM_PROMPT(productName)
    const imagePart = {
      inlineData: {
        data: imageBase64.split(',')[1] || imageBase64,
        mimeType: 'image/jpeg'
      }
    }

    const result = await model.generateContent([prompt, imagePart])
    const response = result.response.text()
    
    return JSON.parse(response)
  } catch (error: any) {
    console.error('[Gemini Error]:', error)
    throw new Error(`Gemini: ${error.message}`)
  }
}

// ===== QUERY HUGGING FACE MODEL =====
async function queryHuggingFace(
  endpoint: string, 
  token: string, 
  imageBase64: string, 
  productName?: string
): Promise<any> {
  try {
    const prompt = `Analyze this product image${productName ? ` (Product: ${productName})` : ''}. 
Provide: product_type, key_features (3 items), colors (3 hex codes), visual_style, ai_prompt.
Return as JSON.`

    const imageData = imageBase64.split(',')[1] || imageBase64

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_tokens: 500,
          temperature: 0.7
        }
      })
    })

    if (response.status === 503) {
      return {
        error: 'Model is loading',
        message: 'Mô hình đang khởi động. Vui lòng thử lại sau 20 giây.',
        estimated_wait: '20s'
      }
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const text = await response.text()
    
    // Try to parse as JSON
    try {
      return JSON.parse(text)
    } catch {
      // If not JSON, create standardized response
      return {
        technical_analysis: {
          product_type: 'Unknown',
          key_features: ['Feature detection failed'],
          colors: ['#000000'],
          visual_style: 'Unable to analyze',
          raw_response: text.substring(0, 200)
        },
        error: 'Non-JSON response'
      }
    }
  } catch (error: any) {
    console.error('[HF Error]:', error)
    throw error
  }
}

// ===== MAIN API HANDLER =====
export async function POST(request: NextRequest) {
  try {
    const { imageBase64, selectedModels, productName } = await request.json()

    if (!imageBase64) {
      return NextResponse.json(
        { success: false, error: 'Image is required' },
        { status: 400 }
      )
    }

    if (!selectedModels || selectedModels.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one model must be selected' },
        { status: 400 }
      )
    }

    console.log(`[Multi-Model Analysis] Starting with ${selectedModels.length} models...`)
    console.log(`[Product Name]`, productName || 'Auto-detect')

    // Create analysis tasks for each selected model
    const analysisTasks = selectedModels.map(async (modelId: string) => {
      const modelConfig = AVAILABLE_MODELS[modelId as keyof typeof AVAILABLE_MODELS]
      
      if (!modelConfig) {
        return {
          model: modelId,
          error: 'Model not found',
          success: false
        }
      }

      const startTime = Date.now()

      try {
        let result

        if (modelConfig.type === 'api' && modelId === 'gemini') {
          result = await queryGemini(imageBase64, productName)
        } else if (modelConfig.type === 'huggingface') {
          result = await queryHuggingFace(
            modelConfig.endpoint!,
            modelConfig.token!,
            imageBase64,
            productName
          )
        }

        const processingTime = ((Date.now() - startTime) / 1000).toFixed(2) + 's'

        return {
          model: modelConfig.name,
          modelId: modelConfig.id,
          provider: modelConfig.provider,
          success: true,
          data: result,
          processing_time: processingTime
        }
      } catch (error: any) {
        console.error(`[${modelConfig.name}] Error:`, error.message)
        
        return {
          model: modelConfig.name,
          modelId: modelConfig.id,
          provider: modelConfig.provider,
          success: false,
          error: error.message || 'Analysis failed',
          processing_time: ((Date.now() - startTime) / 1000).toFixed(2) + 's'
        }
      }
    })

    // Execute all analysis tasks in parallel with error isolation
    const results = await Promise.allSettled(analysisTasks)

    // Process results
    const processedResults = results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value
      } else {
        const modelId = selectedModels[index]
        const modelConfig = AVAILABLE_MODELS[modelId as keyof typeof AVAILABLE_MODELS]
        
        return {
          model: modelConfig?.name || modelId,
          modelId: modelId,
          provider: modelConfig?.provider || 'Unknown',
          success: false,
          error: result.reason?.message || 'Promise rejected',
          processing_time: '0s'
        }
      }
    })

    // Count successful results
    const successCount = processedResults.filter(r => r.success).length
    const failureCount = processedResults.length - successCount

    console.log(`[Multi-Model Analysis] Complete: ${successCount} success, ${failureCount} failed`)

    return NextResponse.json({
      success: true,
      results: processedResults,
      summary: {
        total: processedResults.length,
        successful: successCount,
        failed: failureCount,
        productName: productName || 'Auto-detected'
      }
    })

  } catch (error: any) {
    console.error('[API Error]:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Analysis failed',
        details: error.toString()
      },
      { status: 500 }
    )
  }
}
