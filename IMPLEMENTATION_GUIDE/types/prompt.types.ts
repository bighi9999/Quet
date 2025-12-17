/**
 * Shared TypeScript types for AI Product Image Prompt Generator
 * @module types/prompt.types
 */

/**
 * Product category types supported by the system
 */
export enum ProductCategory {
  CLOTHING = 'clothing',
  FOOTWEAR = 'footwear',
  ACCESSORIES = 'accessories',
  ELECTRONICS = 'electronics',
  COSMETICS = 'cosmetics',
  HOME_GOODS = 'home_goods',
  SPORTS = 'sports',
  UNKNOWN = 'unknown',
}

/**
 * Target audience demographics
 */
export interface TargetAudience {
  text: string;
  gender?: 'male' | 'female' | 'unisex';
  ageRange?: string; // e.g., "25-35"
  style?: string; // e.g., "urban", "casual", "professional"
}

/**
 * Product analysis result from AI
 */
export interface ProductAnalysis {
  category: ProductCategory;
  subcategory?: string;
  colors: string[];
  materials?: string[];
  style: string;
  features: string[];
  suggestedAction: 'wearing' | 'holding' | 'using' | 'reviewing';
}

/**
 * Generated prompt for different AI image generators
 */
export interface GeneratedPrompt {
  stableDiffusion: string;
  midjourney: string;
  dalle: string;
  negativePrompts: string[];
}

/**
 * Request payload for prompt generation
 */
export interface PromptGenerationRequest {
  image: string; // Base64 encoded image
  targetAudience?: string;
}

/**
 * Response from prompt generation API
 */
export interface PromptGenerationResponse {
  success: boolean;
  data?: {
    analysis: ProductAnalysis;
    prompts: GeneratedPrompt;
    processingTime: number;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

/**
 * Image validation result
 */
export interface ImageValidationResult {
  valid: boolean;
  error?: string;
  file?: File;
  base64?: string;
  size?: number;
  type?: string;
}

/**
 * Audience validation result
 */
export interface AudienceValidationResult {
  valid: boolean;
  sanitized: string;
  parsed?: TargetAudience;
  warnings?: string[];
}

/**
 * API error types
 */
export enum APIErrorCode {
  INVALID_IMAGE = 'INVALID_IMAGE',
  IMAGE_TOO_LARGE = 'IMAGE_TOO_LARGE',
  INVALID_AUDIENCE = 'INVALID_AUDIENCE',
  HF_API_ERROR = 'HF_API_ERROR',
  HF_TIMEOUT = 'HF_TIMEOUT',
  HF_AUTH_ERROR = 'HF_AUTH_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}

/**
 * API configuration
 */
export interface APIConfig {
  maxFileSize: number; // in bytes
  allowedMimeTypes: string[];
  maxAudienceLength: number;
  huggingfaceTimeout: number; // in milliseconds
  defaultAudience: string;
}
