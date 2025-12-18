/**
 * Multi-Provider AI Analysis API
 * Supports: Google Gemini, OpenAI GPT-4o, Anthropic Claude, Groq
 * Uses native fetch API for lightweight implementation
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface AnalyzeRequest {
  image: string; // base64 encoded (without data:image prefix)
  prompt: string;
  productName?: string;
}

export async function POST(req: Request) {
  const startTime = Date.now();
  
  try {
    // Extract provider, model, and API key from headers
    const provider = req.headers.get("X-Provider");
    const modelId = req.headers.get("X-Model");
    const apiKey = req.headers.get("X-Key");

    console.log(`[AI Analysis] Provider: ${provider}, Model: ${modelId}`);

    if (!apiKey || !provider || !modelId) {
      return NextResponse.json(
        { error: "Missing required headers: X-Provider, X-Model, X-Key" },
        { status: 401 }
      );
    }

    // Parse request body
    const body: AnalyzeRequest = await req.json();
    const { image, prompt } = body;

    if (!image || !prompt) {
      return NextResponse.json(
        { error: "Missing required fields: image, prompt" },
        { status: 400 }
      );
    }

    let resultText = "";
    const processingStart = Date.now();

    // Route to appropriate provider
    switch (provider) {
      case "google":
        resultText = await analyzeWithGoogle(apiKey, modelId, image, prompt);
        break;

      case "openai":
        resultText = await analyzeWithOpenAI(apiKey, modelId, image, prompt);
        break;

      case "anthropic":
        resultText = await analyzeWithAnthropic(apiKey, modelId, image, prompt);
        break;

      case "groq":
        // Groq uses OpenAI-compatible API format
        resultText = await analyzeWithGroq(apiKey, modelId, image, prompt);
        break;

      default:
        return NextResponse.json(
          { error: `Unsupported provider: ${provider}` },
          { status: 400 }
        );
    }

    const processingTime = Date.now() - processingStart;

    return NextResponse.json({
      result: resultText,
      provider,
      model: modelId,
      processingTime,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('[AI Analysis] Error:', error);
    
    return NextResponse.json(
      { 
        error: error.message || "Analysis failed",
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * Analyze with Google Gemini
 */
async function analyzeWithGoogle(
  apiKey: string, 
  modelId: string, 
  image: string, 
  prompt: string
): Promise<string> {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelId });

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: image,
          mimeType: "image/jpeg"
        }
      }
    ]);

    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error('[Google] Error:', error);
    throw new Error(`Google Gemini error: ${error.message}`);
  }
}

/**
 * Analyze with OpenAI GPT-4o
 * Uses native fetch for lightweight implementation
 */
async function analyzeWithOpenAI(
  apiKey: string,
  modelId: string,
  image: string,
  prompt: string
): Promise<string> {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: modelId,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${image}`,
                  detail: "high"
                }
              }
            ]
          }
        ],
        max_tokens: 1500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: response.statusText } }));
      throw new Error(errorData.error?.message || `OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error("No response from OpenAI");
    }

    return data.choices[0].message.content;
  } catch (error: any) {
    console.error('[OpenAI] Error:', error);
    throw new Error(`OpenAI error: ${error.message}`);
  }
}

/**
 * Analyze with Anthropic Claude
 * Uses native fetch for lightweight implementation
 */
async function analyzeWithAnthropic(
  apiKey: string,
  modelId: string,
  image: string,
  prompt: string
): Promise<string> {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: modelId,
        max_tokens: 1500,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: "image/jpeg",
                  data: image
                }
              },
              {
                type: "text",
                text: prompt
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: response.statusText } }));
      throw new Error(errorData.error?.message || `Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.content || data.content.length === 0) {
      throw new Error("No response from Anthropic");
    }

    // Claude returns an array of content blocks
    return data.content
      .filter((block: any) => block.type === 'text')
      .map((block: any) => block.text)
      .join('\n');
  } catch (error: any) {
    console.error('[Anthropic] Error:', error);
    throw new Error(`Anthropic error: ${error.message}`);
  }
}

/**
 * Analyze with Groq (OpenAI-compatible)
 * Note: Groq currently has limited vision model support
 */
async function analyzeWithGroq(
  apiKey: string,
  modelId: string,
  image: string,
  prompt: string
): Promise<string> {
  try {
    // Check if model supports vision
    const visionModels = ['llama-3.2-90b-vision-preview', 'llama-3.2-11b-vision-preview'];
    
    if (!visionModels.includes(modelId)) {
      throw new Error(`Model ${modelId} does not support vision. Please use a vision-capable model.`);
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: modelId,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${image}`
                }
              }
            ]
          }
        ],
        max_tokens: 1500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: response.statusText } }));
      throw new Error(errorData.error?.message || `Groq API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error("No response from Groq");
    }

    return data.choices[0].message.content;
  } catch (error: any) {
    console.error('[Groq] Error:', error);
    throw new Error(`Groq error: ${error.message}`);
  }
}

/**
 * GET handler for API documentation
 */
export async function GET() {
  return NextResponse.json({
    name: "Multi-Provider AI Analysis API",
    version: "1.0.0",
    description: "Analyze images using multiple AI providers",
    supportedProviders: ["google", "openai", "anthropic", "groq"],
    requiredHeaders: {
      "X-Provider": "AI provider ID (google, openai, anthropic, groq)",
      "X-Model": "Model ID (e.g., gemini-1.5-flash, gpt-4o, claude-3-5-sonnet-20240620)",
      "X-Key": "API key for the selected provider"
    },
    requestBody: {
      image: "Base64 encoded image (without data:image prefix)",
      prompt: "Analysis prompt",
      productName: "Optional product name"
    },
    example: {
      method: "POST",
      headers: {
        "X-Provider": "google",
        "X-Model": "gemini-1.5-flash",
        "X-Key": "your-api-key-here"
      },
      body: {
        image: "base64_image_data_here",
        prompt: "Phân tích sản phẩm trong ảnh này"
      }
    }
  });
}
