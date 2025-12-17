import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export async function POST(request: NextRequest) {
  try {
    const { prompt, aspect_ratio = "9:16" } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    console.log('[Flux API] Generating image with prompt:', prompt)
    console.log('[Flux API] Aspect ratio:', aspect_ratio)

    // Call Flux Schnell model
    const output = await replicate.run(
      "black-forest-labs/flux-schnell",
      {
        input: {
          prompt: prompt,
          aspect_ratio: aspect_ratio,
          output_format: "webp",
          output_quality: 90,
          num_inference_steps: 4
        }
      }
    ) as string[]

    console.log('[Flux API] Generation complete:', output)

    if (!output || output.length === 0) {
      throw new Error('No image generated')
    }

    return NextResponse.json({
      success: true,
      imageUrl: output[0],
      prompt: prompt,
      aspectRatio: aspect_ratio
    })

  } catch (error: any) {
    console.error('[Flux API] Error:', error)
    
    // Check if it's a billing error (402 Payment Required)
    if (error.message && error.message.includes('billing') || error.message.includes('credit')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tài khoản Replicate đã hết tín dụng',
          message: 'Vui lòng nạp thêm tín dụng tại https://replicate.com/account/billing'
        },
        { status: 402 }
      )
    }

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
