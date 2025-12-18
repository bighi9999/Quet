/**
 * Multi-Provider AI Analysis API - CRASH PROOF VERSION
 * [SENIOR_BACKEND_STABILIZER MODE]
 * 
 * Features:
 * - Complete crash protection with try/catch at all levels
 * - Normalizes all responses to safe strings
 * - Handles JSON objects from Gemini 2.0
 * - Auto-fallback for model errors
 * - Never returns raw objects to frontend
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

/**
 * Main POST handler - FULLY CRASH PROTECTED
 */
export async function POST(req: Request) {
  const startTime = Date.now();
  
  try {
    // Extract provider, model, and API key from headers
    const provider = req.headers.get("X-Provider");
    const modelId = req.headers.get("X-Model");
    const apiKey = req.headers.get("X-Key");

    console.log(`[AI Analysis] Provider: ${provider}, Model: ${modelId}`);

    // Validation
    if (!apiKey || !provider || !modelId) {
      return NextResponse.json({
        result: "⚠️ Lỗi cấu hình: Thiếu thông tin provider, model hoặc API key",
        error: "Missing required headers",
        provider: provider || "unknown",
        processingTime: Date.now() - startTime
      });
    }

    // Parse request body with error handling
    let body: AnalyzeRequest;
    try {
      body = await req.json();
    } catch (parseError: any) {
      return NextResponse.json({
        result: `⚠️ Lỗi dữ liệu đầu vào: ${parseError.message}`,
        error: "Invalid JSON body",
        provider,
        processingTime: Date.now() - startTime
      });
    }

    const { image, prompt } = body;

    if (!image || !prompt) {
      return NextResponse.json({
        result: "⚠️ Lỗi: Thiếu ảnh hoặc prompt phân tích",
        error: "Missing image or prompt",
        provider,
        processingTime: Date.now() - startTime
      });
    }

    let resultText = "";
    const processingStart = Date.now();

    // Route to appropriate provider with full error handling
    try {
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
          resultText = await analyzeWithGroq(apiKey, modelId, image, prompt);
          break;

        default:
          resultText = `⚠️ Lỗi: Provider "${provider}" không được hỗ trợ. Vui lòng chọn: google, openai, anthropic, hoặc groq.`;
      }
    } catch (providerError: any) {
      console.error(`[${provider}] Provider Error:`, providerError);
      resultText = `⚠️ Lỗi khi gọi ${provider}: ${providerError.message}\n\nVui lòng:\n1. Kiểm tra API Key\n2. Kiểm tra model có tồn tại\n3. Thử lại sau vài giây`;
    }

    const processingTime = Date.now() - processingStart;

    // Normalize response - CRITICAL: Always return string
    const normalizedResult = normalizeResponse(resultText);

    return NextResponse.json({
      result: normalizedResult,
      provider,
      model: modelId,
      processingTime,
      timestamp: new Date().toISOString(),
      success: !normalizedResult.startsWith('⚠️')
    });

  } catch (error: any) {
    // Ultimate fallback - server will NEVER crash
    console.error('[AI Analysis] Critical Error:', error);
    
    return NextResponse.json({
      result: `⚠️ Lỗi hệ thống nghiêm trọng: ${error.message}\n\nVui lòng liên hệ quản trị viên hoặc thử lại sau.`,
      error: error.message || "Unknown critical error",
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      processingTime: Date.now() - startTime,
      success: false
    });
  }
}

/**
 * NORMALIZE RESPONSE - Converts ANY data type to safe string
 * This prevents "Objects are not valid as React child" errors
 */
function normalizeResponse(data: any): string {
  try {
    // Already a string
    if (typeof data === 'string') {
      // Try to detect if it's a JSON string
      try {
        const parsed = JSON.parse(data);
        // If parsing succeeds and it's an object with title/description
        if (typeof parsed === 'object' && parsed !== null) {
          if (parsed.title || parsed.description) {
            return formatStructuredData(parsed);
          }
          // Other object types - stringify nicely
          return JSON.stringify(parsed, null, 2);
        }
        // Parsed but not an object - return original string
        return data;
      } catch (e) {
        // Not JSON - return as is
        return data;
      }
    }

    // It's an object (from Gemini 2.0)
    if (typeof data === 'object' && data !== null) {
      return formatStructuredData(data);
    }

    // Other types (number, boolean, etc.)
    return String(data);
  } catch (error) {
    console.error('[Normalize] Error:', error);
    return '⚠️ Không thể chuẩn hóa dữ liệu phản hồi';
  }
}

/**
 * Format structured data (title/description) into readable markdown
 */
function formatStructuredData(obj: any): string {
  try {
    let result = '';
    
    // Title
    if (obj.title) {
      result += `## ${obj.title}\n\n`;
    }
    
    // Description
    if (obj.description) {
      result += `${obj.description}\n\n`;
    }
    
    // Additional fields
    if (obj.features && Array.isArray(obj.features)) {
      result += `### Đặc điểm:\n`;
      obj.features.forEach((feature: any) => {
        result += `- ${feature}\n`;
      });
      result += '\n';
    }
    
    if (obj.price) {
      result += `**Giá ước tính:** ${obj.price}\n\n`;
    }
    
    if (obj.category) {
      result += `**Danh mục:** ${obj.category}\n\n`;
    }
    
    // If object has other fields, add them
    const knownFields = ['title', 'description', 'features', 'price', 'category'];
    const otherFields = Object.keys(obj).filter(key => !knownFields.includes(key));
    
    if (otherFields.length > 0) {
      result += `### Thông tin bổ sung:\n`;
      otherFields.forEach(key => {
        const value = obj[key];
        if (typeof value === 'object') {
          result += `**${key}:** ${JSON.stringify(value)}\n`;
        } else {
          result += `**${key}:** ${value}\n`;
        }
      });
    }
    
    return result.trim() || JSON.stringify(obj, null, 2);
  } catch (error) {
    console.error('[Format] Error:', error);
    return JSON.stringify(obj, null, 2);
  }
}

/**
 * Analyze with Google Gemini - CRASH PROOF
 * Includes auto-fallback for model errors
 */
async function analyzeWithGoogle(
  apiKey: string, 
  modelId: string, 
  image: string, 
  prompt: string
): Promise<string> {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try with specified model first
    try {
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
      const textResponse = response.text();
      
      // Normalize the response
      return normalizeResponse(textResponse);
    } catch (modelError: any) {
      console.error(`[Google] Model ${modelId} failed:`, modelError.message);
      
      // Auto-fallback logic
      const fallbackModels = ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro'];
      
      // If the requested model failed and it's not in fallback list, try fallback
      if (!fallbackModels.includes(modelId)) {
        console.log(`[Google] Attempting fallback to gemini-1.5-flash`);
        
        try {
          const fallbackModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
          const fallbackResult = await fallbackModel.generateContent([
            prompt,
            {
              inlineData: {
                data: image,
                mimeType: "image/jpeg"
              }
            }
          ]);
          
          const fallbackResponse = await fallbackResult.response;
          const fallbackText = fallbackResponse.text();
          
          // Prepend a note about fallback
          return `⚠️ Lưu ý: Model ${modelId} không khả dụng, đã tự động chuyển sang gemini-1.5-flash\n\n` + normalizeResponse(fallbackText);
        } catch (fallbackError) {
          console.error('[Google] Fallback also failed:', fallbackError);
          throw modelError; // Throw original error
        }
      }
      
      // If it's already a fallback model or fallback failed, throw
      throw modelError;
    }
  } catch (error: any) {
    console.error('[Google] Critical Error:', error);
    
    // Return user-friendly error message
    let errorMsg = `Lỗi Google Gemini: ${error.message}`;
    
    if (error.message?.includes('API_KEY_INVALID')) {
      errorMsg = 'API Key không hợp lệ. Vui lòng kiểm tra lại API Key trong Cài Đặt.';
    } else if (error.message?.includes('quota')) {
      errorMsg = 'Đã vượt quá giới hạn sử dụng API. Vui lòng thử lại sau hoặc kiểm tra quota.';
    } else if (error.message?.includes('not found')) {
      errorMsg = `Model "${modelId}" không tồn tại. Vui lòng chọn model khác.`;
    }
    
    throw new Error(errorMsg);
  }
}

/**
 * Analyze with OpenAI GPT-4o - CRASH PROOF
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
      const errorData = await response.json().catch(() => ({ 
        error: { message: `HTTP ${response.status}: ${response.statusText}` } 
      }));
      
      let errorMsg = errorData.error?.message || `OpenAI API error: ${response.status}`;
      
      if (response.status === 401) {
        errorMsg = 'API Key không hợp lệ. Vui lòng kiểm tra lại API Key OpenAI.';
      } else if (response.status === 429) {
        errorMsg = 'Đã vượt quá giới hạn request. Vui lòng thử lại sau vài phút.';
      } else if (response.status === 404) {
        errorMsg = `Model "${modelId}" không tồn tại hoặc bạn không có quyền truy cập.`;
      }
      
      throw new Error(errorMsg);
    }

    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error("OpenAI không trả về kết quả. Vui lòng thử lại.");
    }

    const resultText = data.choices[0].message.content;
    return normalizeResponse(resultText);
  } catch (error: any) {
    console.error('[OpenAI] Error:', error);
    throw new Error(`OpenAI error: ${error.message}`);
  }
}

/**
 * Analyze with Anthropic Claude - CRASH PROOF
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
      const errorData = await response.json().catch(() => ({ 
        error: { message: `HTTP ${response.status}: ${response.statusText}` } 
      }));
      
      let errorMsg = errorData.error?.message || `Anthropic API error: ${response.status}`;
      
      if (response.status === 401) {
        errorMsg = 'API Key không hợp lệ. Vui lòng kiểm tra lại API Key Anthropic.';
      } else if (response.status === 429) {
        errorMsg = 'Đã vượt quá giới hạn request. Vui lòng thử lại sau.';
      }
      
      throw new Error(errorMsg);
    }

    const data = await response.json();
    
    if (!data.content || data.content.length === 0) {
      throw new Error("Claude không trả về kết quả. Vui lòng thử lại.");
    }

    // Claude returns an array of content blocks
    const resultText = data.content
      .filter((block: any) => block.type === 'text')
      .map((block: any) => block.text)
      .join('\n');
      
    return normalizeResponse(resultText);
  } catch (error: any) {
    console.error('[Anthropic] Error:', error);
    throw new Error(`Anthropic error: ${error.message}`);
  }
}

/**
 * Analyze with Groq - CRASH PROOF
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
      throw new Error(`Model "${modelId}" không hỗ trợ xử lý ảnh. Vui lòng chọn: llama-3.2-90b-vision-preview hoặc llama-3.2-11b-vision-preview`);
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
      const errorData = await response.json().catch(() => ({ 
        error: { message: `HTTP ${response.status}: ${response.statusText}` } 
      }));
      
      let errorMsg = errorData.error?.message || `Groq API error: ${response.status}`;
      
      if (response.status === 401) {
        errorMsg = 'API Key không hợp lệ. Vui lòng kiểm tra lại API Key Groq.';
      } else if (response.status === 429) {
        errorMsg = 'Đã vượt quá giới hạn request. Vui lòng thử lại sau.';
      }
      
      throw new Error(errorMsg);
    }

    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error("Groq không trả về kết quả. Vui lòng thử lại.");
    }

    const resultText = data.choices[0].message.content;
    return normalizeResponse(resultText);
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
    name: "Multi-Provider AI Analysis API - Crash Proof Edition",
    version: "2.0.0",
    mode: "[SENIOR_BACKEND_STABILIZER]",
    description: "Analyze images using multiple AI providers with complete crash protection",
    features: [
      "✅ Complete crash protection",
      "✅ Normalizes all responses to strings",
      "✅ Handles JSON objects from Gemini 2.0",
      "✅ Auto-fallback for model errors",
      "✅ User-friendly error messages",
      "✅ Never crashes the server"
    ],
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
    responseFormat: {
      result: "ALWAYS a string - never an object",
      provider: "Provider used",
      model: "Model used",
      processingTime: "Time in milliseconds",
      success: "Boolean indicating success",
      timestamp: "ISO timestamp"
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
