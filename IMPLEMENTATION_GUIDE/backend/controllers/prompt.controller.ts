/**
 * Prompt Generation Controller
 * Handles business logic for prompt generation
 * @module controllers/prompt.controller
 */

import { Request, Response } from 'express';
import { HuggingFaceService } from '../services/huggingface.service';
import { PromptBuilderService } from '../services/promptBuilder.service';
import {
  sanitizeBase64Image,
  sanitizeAudience,
} from '../utils/sanitizer';
import {
  API_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  FALLBACK_PROMPTS,
} from '../utils/constants';
import {
  PromptGenerationRequest,
  PromptGenerationResponse,
  APIErrorCode,
} from '../../types/prompt.types';

/**
 * Prompt Controller
 */
export class PromptController {
  private hfService: HuggingFaceService;
  private promptBuilder: PromptBuilderService;

  constructor(huggingfaceApiKey: string) {
    this.hfService = new HuggingFaceService(huggingfaceApiKey);
    this.promptBuilder = new PromptBuilderService();
  }

  /**
   * Generate AI prompts from product image
   * @route POST /api/generate-prompt
   */
  async generatePrompt(req: Request, res: Response): Promise<void> {
    const startTime = Date.now();

    try {
      // Extract and validate request data
      const { image, targetAudience } = req.body as PromptGenerationRequest;

      // Validate image
      if (!image) {
        res.status(400).json(this.createErrorResponse(
          APIErrorCode.INVALID_IMAGE,
          ERROR_MESSAGES.NO_IMAGE
        ));
        return;
      }

      // Sanitize and validate image
      const imageValidation = sanitizeBase64Image(image, API_CONFIG.maxFileSize);

      if (!imageValidation.valid) {
        const errorCode = imageValidation.error?.includes('size')
          ? APIErrorCode.IMAGE_TOO_LARGE
          : APIErrorCode.INVALID_IMAGE;

        res.status(400).json(this.createErrorResponse(
          errorCode,
          imageValidation.error || ERROR_MESSAGES.INVALID_IMAGE
        ));
        return;
      }

      // Sanitize audience
      const sanitizedAudience = targetAudience
        ? sanitizeAudience(targetAudience, API_CONFIG.maxAudienceLength)
        : API_CONFIG.defaultAudience;

      // Validate audience length
      if (targetAudience && targetAudience.length > API_CONFIG.maxAudienceLength) {
        res.status(400).json(this.createErrorResponse(
          APIErrorCode.INVALID_AUDIENCE,
          ERROR_MESSAGES.INVALID_AUDIENCE
        ));
        return;
      }

      // Use default if audience is empty after sanitization
      const finalAudience = sanitizedAudience || API_CONFIG.defaultAudience;

      try {
        // Call Hugging Face API for product analysis
        const analysis = await this.hfService.analyzeProduct(
          imageValidation.data!,
          finalAudience
        );

        // Generate prompts
        const prompts = this.promptBuilder.generatePrompts(analysis, finalAudience);

        // Calculate processing time
        const processingTime = Date.now() - startTime;

        // Send success response
        const response: PromptGenerationResponse = {
          success: true,
          data: {
            analysis,
            prompts,
            processingTime,
          },
        };

        res.status(200).json(response);
      } catch (apiError: any) {
        // Handle AI analysis errors with fallback
        console.warn('AI analysis failed, using fallback prompts:', apiError.message);

        // Use fallback prompts
        const processingTime = Date.now() - startTime;

        const response: PromptGenerationResponse = {
          success: true,
          data: {
            analysis: {
              category: 'unknown' as any,
              colors: ['neutral'],
              style: 'modern',
              features: ['product'],
              suggestedAction: 'holding',
            },
            prompts: {
              ...FALLBACK_PROMPTS.generic,
            },
            processingTime,
          },
        };

        res.status(200).json(response);
      }
    } catch (error: any) {
      console.error('Prompt generation error:', error);

      // Determine error code
      let errorCode = APIErrorCode.INTERNAL_ERROR;
      let errorMessage = ERROR_MESSAGES.INTERNAL_ERROR;

      if (error.code) {
        errorCode = error.code;
        errorMessage = ERROR_MESSAGES[error.code as keyof typeof ERROR_MESSAGES] || errorMessage;
      }

      res.status(500).json(this.createErrorResponse(errorCode, errorMessage, {
        timestamp: new Date().toISOString(),
      }));
    }
  }

  /**
   * Get supported product types
   * @route GET /api/supported-types
   */
  async getSupportedTypes(req: Request, res: Response): Promise<void> {
    try {
      const supportedTypes = [
        {
          type: 'clothing',
          examples: ['shirts', 't-shirts', 'dresses', 'jackets', 'pants'],
          strategy: 'Full body modeling shot',
        },
        {
          type: 'footwear',
          examples: ['shoes', 'sneakers', 'boots', 'sandals'],
          strategy: 'Full body with footwear focus',
        },
        {
          type: 'accessories',
          examples: ['bags', 'watches', 'jewelry', 'sunglasses'],
          strategy: 'Close-up modeling or lifestyle',
        },
        {
          type: 'electronics',
          examples: ['phones', 'laptops', 'headphones', 'cameras'],
          strategy: 'Lifestyle hands-on demonstration',
        },
        {
          type: 'cosmetics',
          examples: ['makeup', 'skincare', 'perfumes'],
          strategy: 'Beauty application shot',
        },
        {
          type: 'home_goods',
          examples: ['furniture', 'decor', 'lighting'],
          strategy: 'Lifestyle scene integration',
        },
        {
          type: 'sports',
          examples: ['fitness equipment', 'athletic wear'],
          strategy: 'Action/fitness modeling',
        },
      ];

      res.status(200).json({
        success: true,
        supportedTypes,
        totalCategories: supportedTypes.length,
      });
    } catch (error) {
      console.error('Error fetching supported types:', error);
      res.status(500).json(this.createErrorResponse(
        APIErrorCode.INTERNAL_ERROR,
        ERROR_MESSAGES.INTERNAL_ERROR
      ));
    }
  }

  /**
   * Create error response
   * @param code - Error code
   * @param message - Error message
   * @param details - Additional error details
   * @returns Error response object
   */
  private createErrorResponse(
    code: APIErrorCode,
    message: string,
    details?: any
  ): PromptGenerationResponse {
    return {
      success: false,
      error: {
        code,
        message,
        details,
      },
    };
  }
}
