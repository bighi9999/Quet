/**
 * AI Model Registry Configuration
 * Central configuration for managing multiple AI providers and their models
 * @module ai-config
 */

export interface AIModel {
  id: string;
  name: string;
  description?: string;
  maxTokens?: number;
  supportsVision?: boolean;
}

export interface AIProvider {
  id: string;
  name: string;
  models: AIModel[];
  icon: string;
  placeholder: string;
  apiUrl?: string;
  description?: string;
  color?: string; // Cyberpunk theme color
}

/**
 * Complete AI Provider Registry
 * Add new providers here to automatically enable them across the system
 */
export const AI_PROVIDERS: AIProvider[] = [
  {
    id: 'google',
    name: 'Google Gemini',
    icon: '⚡',
    placeholder: 'AIzaSy...',
    apiUrl: 'https://generativelanguage.googleapis.com',
    description: 'Fast and efficient AI models from Google',
    color: '#00ff41', // Neon green
    models: [
      {
        id: 'gemini-1.5-flash',
        name: 'Gemini 1.5 Flash',
        description: 'Nhanh - Phân tích tức thì',
        maxTokens: 8192,
        supportsVision: true
      },
      {
        id: 'gemini-1.5-pro',
        name: 'Gemini 1.5 Pro',
        description: 'Thông minh - Phân tích sâu',
        maxTokens: 32768,
        supportsVision: true
      },
      {
        id: 'gemini-2.0-flash-exp',
        name: 'Gemini 2.0 Flash (Experimental)',
        description: 'Mới nhất - Hiệu năng cao',
        maxTokens: 8192,
        supportsVision: true
      }
    ]
  },
  {
    id: 'openai',
    name: 'OpenAI',
    icon: '🤖',
    placeholder: 'sk-proj...',
    apiUrl: 'https://api.openai.com/v1',
    description: 'Advanced GPT models with vision capabilities',
    color: '#00d9ff', // Cyan blue
    models: [
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        description: 'Đa phương tiện - Vision + Text',
        maxTokens: 4096,
        supportsVision: true
      },
      {
        id: 'gpt-4o-mini',
        name: 'GPT-4o Mini',
        description: 'Tiết kiệm - Nhanh & rẻ',
        maxTokens: 16384,
        supportsVision: true
      },
      {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        description: 'Cao cấp - Vision + 128K context',
        maxTokens: 4096,
        supportsVision: true
      }
    ]
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    icon: '🧠',
    placeholder: 'sk-ant...',
    apiUrl: 'https://api.anthropic.com/v1',
    description: 'Advanced reasoning with Claude models',
    color: '#ff00ff', // Magenta
    models: [
      {
        id: 'claude-3-5-sonnet-20240620',
        name: 'Claude 3.5 Sonnet',
        description: 'Cân bằng - Thông minh & nhanh',
        maxTokens: 8192,
        supportsVision: true
      },
      {
        id: 'claude-3-opus-20240229',
        name: 'Claude 3 Opus',
        description: 'Cao cấp - Phân tích phức tạp',
        maxTokens: 4096,
        supportsVision: true
      },
      {
        id: 'claude-3-haiku-20240307',
        name: 'Claude 3 Haiku',
        description: 'Nhanh - Tiết kiệm chi phí',
        maxTokens: 4096,
        supportsVision: true
      }
    ]
  },
  {
    id: 'groq',
    name: 'Groq (LPU)',
    icon: '⚡',
    placeholder: 'gsk_...',
    apiUrl: 'https://api.groq.com/openai/v1',
    description: 'Ultra-fast inference with LPU technology',
    color: '#ffa500', // Orange
    models: [
      {
        id: 'llama-3.3-70b-versatile',
        name: 'Llama 3.3 70B',
        description: 'Mạnh mẽ - Open source',
        maxTokens: 32768,
        supportsVision: false
      },
      {
        id: 'llama-3.2-90b-vision-preview',
        name: 'Llama 3.2 90B Vision',
        description: 'Vision - Phân tích ảnh',
        maxTokens: 8192,
        supportsVision: true
      },
      {
        id: 'mixtral-8x7b-32768',
        name: 'Mixtral 8x7B',
        description: 'Nhanh - MoE architecture',
        maxTokens: 32768,
        supportsVision: false
      }
    ]
  }
];

/**
 * Get provider by ID
 */
export function getProvider(providerId: string): AIProvider | undefined {
  return AI_PROVIDERS.find(p => p.id === providerId);
}

/**
 * Get model from provider
 */
export function getModel(providerId: string, modelId: string): AIModel | undefined {
  const provider = getProvider(providerId);
  return provider?.models.find(m => m.id === modelId);
}

/**
 * Get all models that support vision
 */
export function getVisionModels(): Array<{ provider: AIProvider; model: AIModel }> {
  const visionModels: Array<{ provider: AIProvider; model: AIModel }> = [];
  
  AI_PROVIDERS.forEach(provider => {
    provider.models.forEach(model => {
      if (model.supportsVision) {
        visionModels.push({ provider, model });
      }
    });
  });
  
  return visionModels;
}

/**
 * LocalStorage key format for API keys
 */
export function getApiKeyStorageKey(providerId: string): string {
  return `api_key_${providerId}`;
}

/**
 * Check if API key exists in localStorage (client-side only)
 */
export function hasApiKey(providerId: string): boolean {
  if (typeof window === 'undefined') return false;
  const key = localStorage.getItem(getApiKeyStorageKey(providerId));
  return !!key && key.length > 0;
}

/**
 * Get API key from localStorage (client-side only)
 */
export function getApiKey(providerId: string): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(getApiKeyStorageKey(providerId));
}

/**
 * Save API key to localStorage (client-side only)
 */
export function saveApiKey(providerId: string, apiKey: string): void {
  if (typeof window === 'undefined') return;
  if (apiKey && apiKey.trim().length > 0) {
    localStorage.setItem(getApiKeyStorageKey(providerId), apiKey.trim());
  }
}

/**
 * Remove API key from localStorage (client-side only)
 */
export function removeApiKey(providerId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(getApiKeyStorageKey(providerId));
}

/**
 * Get all configured providers (those with API keys)
 */
export function getConfiguredProviders(): AIProvider[] {
  if (typeof window === 'undefined') return [];
  return AI_PROVIDERS.filter(provider => hasApiKey(provider.id));
}

/**
 * Default analysis prompt for product images
 */
export const DEFAULT_ANALYSIS_PROMPT = `Bạn là chuyên gia phân tích sản phẩm thương mại điện tử. 
Hãy phân tích chi tiết sản phẩm trong ảnh này theo cấu trúc sau:

1. **Mô tả sản phẩm**: Tên, loại, màu sắc, chất liệu
2. **Đặc điểm nổi bật**: Thiết kế, công dụng, ưu điểm
3. **Phân khúc thị trường**: Đối tượng mục tiêu, giá ước tính
4. **Gợi ý Marketing**: Tiêu đề, mô tả ngắn cho Shopee/Lazada

Trả lời bằng tiếng Việt, chi tiết và chuyên nghiệp.`;
