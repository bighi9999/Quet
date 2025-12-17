/**
 * Application constants and configuration
 * @module utils/constants
 */

import { APIConfig } from '../../types/prompt.types';

/**
 * API Configuration constants
 */
export const API_CONFIG: APIConfig = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/jpg'],
  maxAudienceLength: 100,
  huggingfaceTimeout: 30000, // 30 seconds
  defaultAudience: 'general audience',
};

/**
 * Hugging Face API Configuration
 */
export const HUGGINGFACE_CONFIG = {
  apiUrl: 'https://api-inference.huggingface.co/models',
  model: 'llava-hf/llava-1.5-7b-hf',
  maxRetries: 3,
  retryDelay: 1000, // 1 second
};

/**
 * Product detection keywords
 */
export const PRODUCT_KEYWORDS = {
  clothing: [
    'shirt', 't-shirt', 'dress', 'jacket', 'coat', 'pants', 'jeans',
    'skirt', 'blouse', 'sweater', 'hoodie', 'suit', 'blazer',
  ],
  footwear: [
    'shoe', 'shoes', 'sneaker', 'boot', 'sandal', 'heel', 'loafer',
    'slipper', 'athletic shoe', 'running shoe',
  ],
  accessories: [
    'bag', 'purse', 'wallet', 'watch', 'jewelry', 'necklace', 'bracelet',
    'ring', 'earring', 'sunglasses', 'belt', 'hat', 'scarf',
  ],
  electronics: [
    'phone', 'laptop', 'computer', 'tablet', 'camera', 'headphone',
    'speaker', 'smartwatch', 'keyboard', 'mouse', 'monitor',
  ],
  cosmetics: [
    'makeup', 'lipstick', 'foundation', 'perfume', 'skincare', 'cream',
    'lotion', 'serum', 'mascara', 'eyeshadow', 'blush',
  ],
  home_goods: [
    'furniture', 'chair', 'table', 'lamp', 'decor', 'vase', 'pillow',
    'blanket', 'rug', 'curtain', 'mirror',
  ],
  sports: [
    'fitness equipment', 'dumbbell', 'yoga mat', 'athletic wear',
    'sports gear', 'ball', 'racket', 'bicycle',
  ],
};

/**
 * Action verbs for different product categories
 */
export const PRODUCT_ACTIONS = {
  clothing: 'wearing',
  footwear: 'wearing',
  accessories: 'showcasing',
  electronics: 'holding and reviewing',
  cosmetics: 'applying',
  home_goods: 'using in a lifestyle setting',
  sports: 'actively using',
};

/**
 * Fallback prompts for error scenarios
 */
export const FALLBACK_PROMPTS = {
  generic: {
    stableDiffusion: 'Professional product photography, person interacting with product naturally, studio lighting, neutral background, commercial quality, 8k resolution',
    midjourney: 'Professional model showcasing product, modern commercial photography style, perfect lighting, high-end fashion editorial aesthetic --ar 16:9 --style raw',
    dalle: 'High-quality product photography with a person naturally interacting with the product, professional studio lighting, clean background, photorealistic',
    negativePrompts: [
      'blurry', 'distorted', 'low quality', 'amateur', 'poor lighting',
      'watermark', 'text overlay', 'bad anatomy', 'deformed',
    ],
  },
};

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  INVALID_IMAGE: 'Please upload a valid JPG or PNG image',
  IMAGE_TOO_LARGE: 'Image size must not exceed 5MB',
  NO_IMAGE: 'Please upload an image',
  INVALID_AUDIENCE: 'Target audience must be 100 characters or less',
  HF_API_ERROR: 'Failed to analyze image. Please try again.',
  HF_TIMEOUT: 'Image analysis timed out. Please try again with a smaller image.',
  HF_AUTH_ERROR: 'Authentication failed. Please contact support.',
  INTERNAL_ERROR: 'An unexpected error occurred. Please try again.',
  RATE_LIMIT: 'Too many requests. Please wait a moment and try again.',
};

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  PROMPT_GENERATED: 'AI prompts generated successfully',
};

/**
 * Rate limiting configuration
 */
export const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 20, // Max 20 requests per window
  message: ERROR_MESSAGES.RATE_LIMIT,
};
