/**
 * Prompt Builder Service
 * Generates optimized prompts for different AI image generators
 * @module services/promptBuilder.service
 */

import {
  ProductAnalysis,
  ProductCategory,
  GeneratedPrompt,
  TargetAudience,
} from '../../types/prompt.types';

/**
 * Prompt Builder Service
 */
export class PromptBuilderService {
  /**
   * Generate prompts for all AI image generators
   * @param analysis - Product analysis from Hugging Face
   * @param audience - Target audience
   * @returns Generated prompts for SD, Midjourney, DALL-E
   */
  generatePrompts(analysis: ProductAnalysis, audience: string): GeneratedPrompt {
    // Parse audience demographics
    const parsedAudience = this.parseAudience(audience);

    // Generate model description
    const modelDescription = this.generateModelDescription(analysis, parsedAudience);

    // Generate scene description
    const sceneDescription = this.generateSceneDescription(analysis);

    // Generate quality modifiers
    const qualityModifiers = this.generateQualityModifiers();

    // Build prompts for each platform
    return {
      stableDiffusion: this.buildStableDiffusionPrompt(
        analysis,
        modelDescription,
        sceneDescription,
        qualityModifiers
      ),
      midjourney: this.buildMidjourneyPrompt(
        analysis,
        modelDescription,
        sceneDescription,
        qualityModifiers
      ),
      dalle: this.buildDALLEPrompt(
        analysis,
        modelDescription,
        sceneDescription,
        qualityModifiers
      ),
      negativePrompts: this.generateNegativePrompts(analysis),
    };
  }

  /**
   * Parse audience string into structured data
   * @param audience - Raw audience string
   * @returns Parsed audience object
   */
  private parseAudience(audience: string): TargetAudience {
    const lowerAudience = audience.toLowerCase();

    // Extract gender
    let gender: 'male' | 'female' | 'unisex' = 'unisex';
    if (lowerAudience.includes('female') || lowerAudience.includes('woman') || lowerAudience.includes('women')) {
      gender = 'female';
    } else if (lowerAudience.includes('male') || lowerAudience.includes('man') || lowerAudience.includes('men')) {
      gender = 'male';
    }

    // Extract age range
    const ageMatch = lowerAudience.match(/(\d+)-(\d+)|(\d+)\s*(?:to|through)\s*(\d+)/);
    const ageRange = ageMatch ? `${ageMatch[1] || ageMatch[3]}-${ageMatch[2] || ageMatch[4]}` : undefined;

    // Extract style keywords
    const styleKeywords = ['urban', 'casual', 'professional', 'formal', 'sporty', 'elegant', 'trendy'];
    const style = styleKeywords.find(keyword => lowerAudience.includes(keyword));

    return {
      text: audience,
      gender,
      ageRange,
      style,
    };
  }

  /**
   * Generate model description based on product and audience
   * @param analysis - Product analysis
   * @param audience - Parsed audience
   * @returns Model description string
   */
  private generateModelDescription(
    analysis: ProductAnalysis,
    audience: TargetAudience
  ): string {
    let description = '';

    // Age descriptor
    if (audience.ageRange) {
      const ages = audience.ageRange.split('-');
      const avgAge = (parseInt(ages[0]) + parseInt(ages[1])) / 2;

      if (avgAge < 25) {
        description += audience.gender === 'female' ? 'young woman' : audience.gender === 'male' ? 'young man' : 'young person';
      } else if (avgAge < 40) {
        description += audience.gender === 'female' ? 'woman' : audience.gender === 'male' ? 'man' : 'person';
      } else {
        description += audience.gender === 'female' ? 'mature woman' : audience.gender === 'male' ? 'mature man' : 'mature person';
      }
    } else {
      description += audience.gender === 'female' ? 'woman' : audience.gender === 'male' ? 'man' : 'model';
    }

    // Style descriptor
    if (audience.style) {
      description += `, ${audience.style} style`;
    }

    // Add action verb
    description += ` ${analysis.suggestedAction}`;

    // Add product reference
    description += ` ${this.getProductReference(analysis)}`;

    return description;
  }

  /**
   * Get product reference phrase
   * @param analysis - Product analysis
   * @returns Product reference
   */
  private getProductReference(analysis: ProductAnalysis): string {
    const colorStr = analysis.colors.length > 0 ? analysis.colors[0] : '';
    const styleStr = analysis.style;

    switch (analysis.category) {
      case ProductCategory.CLOTHING:
        return `${styleStr} ${colorStr} clothing`.trim();
      case ProductCategory.FOOTWEAR:
        return `${styleStr} ${colorStr} footwear`.trim();
      case ProductCategory.ACCESSORIES:
        return `${styleStr} ${colorStr} accessory`.trim();
      case ProductCategory.ELECTRONICS:
        return `${colorStr} electronic device`.trim();
      case ProductCategory.COSMETICS:
        return `${colorStr} cosmetic product`.trim();
      case ProductCategory.HOME_GOODS:
        return `${styleStr} home decor item`.trim();
      case ProductCategory.SPORTS:
        return `${colorStr} sports equipment`.trim();
      default:
        return `${colorStr} product`.trim();
    }
  }

  /**
   * Generate scene description
   * @param analysis - Product analysis
   * @returns Scene description
   */
  private generateSceneDescription(analysis: ProductAnalysis): string {
    const scenes: Record<ProductCategory, string> = {
      [ProductCategory.CLOTHING]: 'modern studio setting with soft natural lighting',
      [ProductCategory.FOOTWEAR]: 'clean minimal background with elegant lighting',
      [ProductCategory.ACCESSORIES]: 'sophisticated lifestyle scene with premium ambiance',
      [ProductCategory.ELECTRONICS]: 'contemporary tech-inspired environment with cool lighting',
      [ProductCategory.COSMETICS]: 'bright beauty studio with flattering soft light',
      [ProductCategory.HOME_GOODS]: 'stylish interior space with warm atmospheric lighting',
      [ProductCategory.SPORTS]: 'dynamic fitness environment with energetic lighting',
      [ProductCategory.UNKNOWN]: 'professional studio with balanced lighting',
    };

    return scenes[analysis.category] || scenes[ProductCategory.UNKNOWN];
  }

  /**
   * Generate quality modifiers
   * @returns Quality modifier string
   */
  private generateQualityModifiers(): string {
    return 'professional photography, 8k uhd, high quality, sharp focus, detailed, photorealistic, commercial quality';
  }

  /**
   * Build Stable Diffusion prompt
   * @param analysis - Product analysis
   * @param modelDesc - Model description
   * @param sceneDesc - Scene description
   * @param quality - Quality modifiers
   * @returns SD-formatted prompt
   */
  private buildStableDiffusionPrompt(
    analysis: ProductAnalysis,
    modelDesc: string,
    sceneDesc: string,
    quality: string
  ): string {
    const parts = [
      'professional product photography',
      modelDesc,
      sceneDesc,
      this.getCompositionGuide(analysis),
      quality,
      'trending on instagram',
      'commercial advertisement',
    ];

    return parts.filter(Boolean).join(', ');
  }

  /**
   * Build Midjourney prompt
   * @param analysis - Product analysis
   * @param modelDesc - Model description
   * @param sceneDesc - Scene description
   * @param quality - Quality modifiers
   * @returns Midjourney-formatted prompt
   */
  private buildMidjourneyPrompt(
    analysis: ProductAnalysis,
    modelDesc: string,
    sceneDesc: string,
    quality: string
  ): string {
    const basePr ompt = [
      'professional product photography',
      modelDesc,
      sceneDesc,
      quality,
      'editorial fashion photography style',
    ].filter(Boolean).join(', ');

    // Add Midjourney-specific parameters
    const parameters = [
      '--ar 16:9',
      '--style raw',
      '--v 6',
      '--q 2',
    ];

    return `${basePrompt} ${parameters.join(' ')}`;
  }

  /**
   * Build DALL-E prompt
   * @param analysis - Product analysis
   * @param modelDesc - Model description
   * @param sceneDesc - Scene description
   * @param quality - Quality modifiers
   * @returns DALL-E-formatted prompt
   */
  private buildDALLEPrompt(
    analysis: ProductAnalysis,
    modelDesc: string,
    sceneDesc: string,
    quality: string
  ): string {
    const parts = [
      'High-quality professional product photography featuring',
      modelDesc,
      'in',
      sceneDesc,
      '.',
      quality.replace(/,/g, '.'),
      'Perfect for commercial use.',
    ];

    return parts.filter(Boolean).join(' ');
  }

  /**
   * Get composition guidelines based on product
   * @param analysis - Product analysis
   * @returns Composition guide
   */
  private getCompositionGuide(analysis: ProductAnalysis): string {
    const guides: Record<ProductCategory, string> = {
      [ProductCategory.CLOTHING]: 'full body shot, centered composition',
      [ProductCategory.FOOTWEAR]: 'full body with focus on footwear, rule of thirds',
      [ProductCategory.ACCESSORIES]: 'close-up product focus, elegant framing',
      [ProductCategory.ELECTRONICS]: 'hands-on demonstration, dynamic angle',
      [ProductCategory.COSMETICS]: 'beauty shot, soft focus on application',
      [ProductCategory.HOME_GOODS]: 'lifestyle integration, natural placement',
      [ProductCategory.SPORTS]: 'action shot, dynamic composition',
      [ProductCategory.UNKNOWN]: 'centered composition, balanced framing',
    };

    return guides[analysis.category] || guides[ProductCategory.UNKNOWN];
  }

  /**
   * Generate negative prompts
   * @param analysis - Product analysis
   * @returns Array of negative prompts
   */
  private generateNegativePrompts(analysis: ProductAnalysis): string[] {
    const baseNegatives = [
      'blurry',
      'low quality',
      'distorted',
      'deformed',
      'amateur',
      'poor lighting',
      'bad anatomy',
      'extra limbs',
      'missing limbs',
      'watermark',
      'text overlay',
      'logo',
      'signature',
      'out of focus',
      'grainy',
      'pixelated',
      'oversaturated',
      'undersaturated',
      'overexposed',
      'underexposed',
    ];

    // Category-specific negatives
    const categoryNegatives: Record<ProductCategory, string[]> = {
      [ProductCategory.CLOTHING]: ['wrinkled', 'stained', 'ill-fitting', 'sloppy'],
      [ProductCategory.FOOTWEAR]: ['scuffed', 'dirty', 'worn out'],
      [ProductCategory.ACCESSORIES]: ['tarnished', 'damaged', 'cheap-looking'],
      [ProductCategory.ELECTRONICS]: ['cracked screen', 'damaged', 'obsolete'],
      [ProductCategory.COSMETICS]: ['clumpy', 'streaky', 'cakey'],
      [ProductCategory.HOME_GOODS]: ['cluttered', 'messy', 'outdated'],
      [ProductCategory.SPORTS]: ['unsafe', 'improper form'],
      [ProductCategory.UNKNOWN]: [],
    };

    return [
      ...baseNegatives,
      ...(categoryNegatives[analysis.category] || []),
    ];
  }
}
