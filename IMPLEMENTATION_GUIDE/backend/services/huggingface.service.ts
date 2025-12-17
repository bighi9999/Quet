/**
 * Hugging Face API Integration Service
 * @module services/huggingface.service
 */

import axios, { AxiosError } from 'axios';
import { HUGGINGFACE_CONFIG, API_CONFIG } from '../utils/constants';
import { ProductAnalysis, ProductCategory, APIErrorCode } from '../../types/prompt.types';

/**
 * Hugging Face Service for AI image analysis
 */
export class HuggingFaceService {
  private apiKey: string;
  private apiUrl: string;
  private model: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Hugging Face API key is required');
    }

    this.apiKey = apiKey;
    this.apiUrl = HUGGINGFACE_CONFIG.apiUrl;
    this.model = HUGGINGFACE_CONFIG.model;
  }

  /**
   * Analyze product image using LLaVA vision model
   * @param base64Image - Base64 encoded image
   * @param targetAudience - Target audience description
   * @returns Product analysis result
   */
  async analyzeProduct(
    base64Image: string,
    targetAudience: string = 'general audience'
  ): Promise<ProductAnalysis> {
    try {
      // Extract raw base64 data (remove data URI prefix)
      const base64Data = base64Image.includes(',')
        ? base64Image.split(',')[1]
        : base64Image;

      // Convert base64 to buffer
      const imageBuffer = Buffer.from(base64Data, 'base64');

      // Create prompt for product analysis
      const prompt = this.createAnalysisPrompt(targetAudience);

      // Call Hugging Face API
      const response = await this.callHuggingFaceAPI(imageBuffer, prompt);

      // Parse response and extract product information
      const analysis = this.parseAnalysisResponse(response);

      return analysis;
    } catch (error) {
      console.error('Hugging Face API error:', error);
      throw this.handleAPIError(error);
    }
  }

  /**
   * Create analysis prompt for vision model
   * @param targetAudience - Target audience
   * @returns Formatted prompt
   */
  private createAnalysisPrompt(targetAudience: string): string {
    return `Analyze this product image in detail. Provide the following information:
1. Product category (clothing, footwear, accessories, electronics, cosmetics, home goods, or sports)
2. Specific product type (e.g., t-shirt, sneakers, laptop)
3. Main colors visible
4. Style or design characteristics
5. Key features or details
6. Suggested action for a model (wearing, holding, using, reviewing)

Target audience: ${targetAudience}

Respond in a structured format with clear labels for each category.`;
  }

  /**
   * Call Hugging Face Inference API
   * @param imageBuffer - Image buffer
   * @param prompt - Analysis prompt
   * @returns API response
   */
  private async callHuggingFaceAPI(
    imageBuffer: Buffer,
    prompt: string
  ): Promise<any> {
    const url = `${this.apiUrl}/${this.model}`;

    try {
      const response = await axios.post(
        url,
        {
          inputs: {
            image: imageBuffer.toString('base64'),
            question: prompt,
          },
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: API_CONFIG.huggingfaceTimeout,
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;

        // Check for specific error types
        if (axiosError.code === 'ECONNABORTED') {
          throw new Error('HF_TIMEOUT');
        }

        if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
          throw new Error('HF_AUTH_ERROR');
        }

        if (axiosError.response?.status === 503) {
          // Model is loading, retry after delay
          await this.delay(HUGGINGFACE_CONFIG.retryDelay);
          return this.callHuggingFaceAPI(imageBuffer, prompt);
        }
      }

      throw error;
    }
  }

  /**
   * Parse API response and extract product analysis
   * @param response - Raw API response
   * @returns Structured product analysis
   */
  private parseAnalysisResponse(response: any): ProductAnalysis {
    try {
      // Handle different response formats
      let analysisText = '';

      if (Array.isArray(response)) {
        analysisText = response[0]?.generated_text || '';
      } else if (typeof response === 'object') {
        analysisText = response.generated_text || response.text || JSON.stringify(response);
      } else {
        analysisText = String(response);
      }

      // Extract product category
      const category = this.detectProductCategory(analysisText);

      // Extract colors
      const colors = this.extractColors(analysisText);

      // Extract style
      const style = this.extractStyle(analysisText);

      // Extract features
      const features = this.extractFeatures(analysisText);

      // Determine suggested action
      const suggestedAction = this.determineSuggestedAction(category);

      return {
        category,
        colors,
        style,
        features,
        suggestedAction,
      };
    } catch (error) {
      console.error('Error parsing analysis response:', error);
      // Return default analysis
      return {
        category: ProductCategory.UNKNOWN,
        colors: ['neutral'],
        style: 'modern',
        features: ['product'],
        suggestedAction: 'holding',
      };
    }
  }

  /**
   * Detect product category from analysis text
   * @param text - Analysis text
   * @returns Product category
   */
  private detectProductCategory(text: string): ProductCategory {
    const lowerText = text.toLowerCase();

    const categories = [
      { category: ProductCategory.CLOTHING, keywords: ['clothing', 'shirt', 'dress', 'jacket', 'wear'] },
      { category: ProductCategory.FOOTWEAR, keywords: ['shoe', 'sneaker', 'boot', 'footwear'] },
      { category: ProductCategory.ACCESSORIES, keywords: ['bag', 'watch', 'jewelry', 'accessory'] },
      { category: ProductCategory.ELECTRONICS, keywords: ['phone', 'laptop', 'electronic', 'device'] },
      { category: ProductCategory.COSMETICS, keywords: ['makeup', 'cosmetic', 'beauty', 'skincare'] },
      { category: ProductCategory.HOME_GOODS, keywords: ['furniture', 'home', 'decor'] },
      { category: ProductCategory.SPORTS, keywords: ['fitness', 'sport', 'athletic', 'exercise'] },
    ];

    for (const { category, keywords } of categories) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return category;
      }
    }

    return ProductCategory.UNKNOWN;
  }

  /**
   * Extract colors from analysis text
   * @param text - Analysis text
   * @returns Array of colors
   */
  private extractColors(text: string): string[] {
    const colorKeywords = [
      'black', 'white', 'red', 'blue', 'green', 'yellow', 'orange', 'purple',
      'pink', 'brown', 'gray', 'grey', 'beige', 'navy', 'teal', 'maroon',
    ];

    const lowerText = text.toLowerCase();
    const foundColors = colorKeywords.filter(color => lowerText.includes(color));

    return foundColors.length > 0 ? foundColors : ['neutral'];
  }

  /**
   * Extract style from analysis text
   * @param text - Analysis text
   * @returns Style description
   */
  private extractStyle(text: string): string {
    const styleKeywords = [
      'modern', 'classic', 'casual', 'formal', 'sporty', 'elegant',
      'minimalist', 'vintage', 'contemporary', 'professional',
    ];

    const lowerText = text.toLowerCase();
    const foundStyle = styleKeywords.find(style => lowerText.includes(style));

    return foundStyle || 'modern';
  }

  /**
   * Extract key features from analysis text
   * @param text - Analysis text
   * @returns Array of features
   */
  private extractFeatures(text: string): string[] {
    // Simple feature extraction - can be enhanced with NLP
    const sentences = text.split(/[.!?]+/);
    const features = sentences
      .filter(s => s.trim().length > 10 && s.trim().length < 100)
      .slice(0, 3)
      .map(s => s.trim());

    return features.length > 0 ? features : ['high-quality product'];
  }

  /**
   * Determine suggested action based on category
   * @param category - Product category
   * @returns Suggested action
   */
  private determineSuggestedAction(
    category: ProductCategory
  ): 'wearing' | 'holding' | 'using' | 'reviewing' {
    const actionMap: Record<ProductCategory, 'wearing' | 'holding' | 'using' | 'reviewing'> = {
      [ProductCategory.CLOTHING]: 'wearing',
      [ProductCategory.FOOTWEAR]: 'wearing',
      [ProductCategory.ACCESSORIES]: 'holding',
      [ProductCategory.ELECTRONICS]: 'reviewing',
      [ProductCategory.COSMETICS]: 'using',
      [ProductCategory.HOME_GOODS]: 'using',
      [ProductCategory.SPORTS]: 'using',
      [ProductCategory.UNKNOWN]: 'holding',
    };

    return actionMap[category] || 'holding';
  }

  /**
   * Handle API errors and convert to custom error codes
   * @param error - Original error
   * @returns Custom error
   */
  private handleAPIError(error: any): Error {
    if (error.message === 'HF_TIMEOUT') {
      const err = new Error('Request timeout');
      (err as any).code = APIErrorCode.HF_TIMEOUT;
      return err;
    }

    if (error.message === 'HF_AUTH_ERROR') {
      const err = new Error('Authentication failed');
      (err as any).code = APIErrorCode.HF_AUTH_ERROR;
      return err;
    }

    const err = new Error('Hugging Face API error');
    (err as any).code = APIErrorCode.HF_API_ERROR;
    return err;
  }

  /**
   * Delay helper for retries
   * @param ms - Milliseconds to delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
