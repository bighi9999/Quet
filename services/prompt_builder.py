"""
Prompt Builder Service - Generate optimized AI image generation prompts
"""

class PromptBuilderService:
    def generate_prompt(self, analysis, target_audience=''):
        """Generate optimized AI image generation prompt"""
        product_type = analysis.get('productType', 'general product')
        features = analysis.get('features', [])
        style = analysis.get('style', 'contemporary')
        colors = analysis.get('colors', [])
        material = analysis.get('material', 'unknown')
        
        # Select prompt strategy
        strategy = self._select_strategy(product_type)
        
        # Build prompt components
        model_desc = self._build_model_description(target_audience, product_type)
        scene_desc = self._build_scene_description(product_type, style)
        product_integration = self._build_product_integration(product_type, features, colors, material)
        technical_specs = self._build_technical_specs(style)
        
        # Assemble final prompt
        main_prompt = self._assemble_prompt(
            model_desc, scene_desc, product_integration, technical_specs, strategy
        )
        
        # Generate negative prompt
        negative_prompt = self._generate_negative_prompt()
        
        return {
            'prompt': main_prompt,
            'negativePrompt': negative_prompt,
            'metadata': {
                'productType': product_type,
                'style': style,
                'strategy': strategy,
                'colors': colors,
                'targetAudience': target_audience or 'general audience'
            },
            'suggestions': self._generate_suggestions(product_type)
        }
    
    def _select_strategy(self, product_type):
        """Select appropriate prompt strategy"""
        strategies = {
            'clothing': 'full_body_modeling',
            'footwear': 'full_body_modeling',
            'accessories': 'close_up_modeling',
            'electronics': 'lifestyle_hands',
            'cosmetics': 'beauty_application',
            'home_goods': 'lifestyle_scene',
            'sports': 'action_modeling'
        }
        return strategies.get(product_type, 'lifestyle_hands')
    
    def _build_model_description(self, target_audience, product_type):
        """Build model description based on audience"""
        base_model = 'professional model'
        characteristics = ['confident expression', 'natural pose']
        
        if target_audience:
            audience_lower = target_audience.lower()
            
            # Age group
            if any(x in audience_lower for x in ['young', 'teen', '20', '25-35']):
                characteristics.append('youthful appearance')
            elif any(x in audience_lower for x in ['mature', '40', '50']):
                characteristics.append('mature sophisticated look')
            
            # Gender
            if any(x in audience_lower for x in ['female', 'woman', 'women']):
                base_model = 'female model'
            elif any(x in audience_lower for x in ['male', 'man', 'men']):
                base_model = 'male model'
            
            # Style
            if 'professional' in audience_lower or 'business' in audience_lower:
                characteristics.append('professional attire')
            elif 'casual' in audience_lower or 'lifestyle' in audience_lower:
                characteristics.append('casual everyday style')
            
            characteristics.append('diverse ethnicity')
        
        # Product-specific adjustments
        if product_type == 'cosmetics':
            characteristics.append('clear skin')
        elif product_type == 'sports':
            characteristics.append('athletic physique')
        
        return f"{base_model}, {', '.join(characteristics)}"
    
    def _build_scene_description(self, product_type, style):
        """Build scene description"""
        scene_templates = {
            'clothing': 'modern urban setting, natural lighting, minimalist background',
            'footwear': 'clean modern floor, urban street scene',
            'accessories': 'elegant backdrop, luxury setting',
            'electronics': 'modern workspace, sleek contemporary interior',
            'cosmetics': 'beauty studio setting, bright natural lighting',
            'home_goods': 'cozy interior, modern living space',
            'sports': 'gym environment, outdoor athletic setting'
        }
        
        scene = scene_templates.get(product_type, 'modern lifestyle setting, natural lighting')
        
        # Add style modifier
        style_modifiers = {
            'modern': 'contemporary clean aesthetic',
            'classic': 'timeless elegant atmosphere',
            'vintage': 'retro-inspired setting',
            'minimalist': 'simple uncluttered space',
            'luxury': 'high-end premium environment',
            'casual': 'relaxed comfortable space'
        }
        
        modifier = style_modifiers.get(style, 'stylish atmosphere')
        return f"{scene}, {modifier}"
    
    def _build_product_integration(self, product_type, features, colors, material):
        """Build product integration description"""
        color_desc = ', '.join(colors) if colors else 'neutral toned'
        material_desc = material if material != 'unknown' else ''
        
        integration_templates = {
            'clothing': f"wearing {color_desc} {material_desc} garment, perfectly fitted, showcasing design details",
            'footwear': f"wearing {color_desc} {material_desc} footwear, prominently displayed",
            'accessories': f"elegantly holding or wearing {color_desc} {material_desc} accessory",
            'electronics': f"naturally interacting with {color_desc} device, using product",
            'cosmetics': f"applying or displaying {color_desc} beauty product",
            'home_goods': f"styled with {color_desc} {material_desc} item",
            'sports': f"actively using {color_desc} sports equipment"
        }
        
        return integration_templates.get(product_type, f"featuring {color_desc} product prominently")
    
    def _build_technical_specs(self, style):
        """Build technical specifications"""
        base_specs = [
            'professional photography',
            'high resolution',
            '8K quality',
            'sharp focus',
            'realistic lighting',
            'natural colors'
        ]
        
        style_specs = {
            'modern': ['clean composition', 'contemporary aesthetic'],
            'classic': ['timeless composition', 'elegant framing'],
            'vintage': ['film photography style', 'warm tones'],
            'luxury': ['high-end photography', 'premium lighting']
        }
        
        specs = base_specs + style_specs.get(style, ['modern composition'])
        return ', '.join(specs)
    
    def _assemble_prompt(self, model_desc, scene_desc, product_integration, technical_specs, strategy):
        """Assemble final prompt"""
        templates = {
            'full_body_modeling': f"Full body shot of {model_desc}, {product_integration}, {scene_desc}, {technical_specs}",
            'close_up_modeling': f"Close-up portrait of {model_desc}, {product_integration}, {scene_desc}, shallow depth of field, {technical_specs}",
            'lifestyle_hands': f"Lifestyle shot of {model_desc}, hands {product_integration}, {scene_desc}, {technical_specs}",
            'beauty_application': f"Beauty shot of {model_desc}, {product_integration}, {scene_desc}, magazine quality, {technical_specs}",
            'lifestyle_scene': f"Lifestyle scene with {model_desc}, {product_integration}, {scene_desc}, editorial style, {technical_specs}",
            'action_modeling': f"Action shot of {model_desc}, actively {product_integration}, {scene_desc}, dynamic composition, {technical_specs}"
        }
        
        return templates.get(strategy, templates['lifestyle_hands'])
    
    def _generate_negative_prompt(self):
        """Generate negative prompt"""
        return ', '.join([
            'blurry', 'low quality', 'distorted', 'deformed', 'disfigured',
            'bad anatomy', 'bad proportions', 'extra limbs', 'missing limbs',
            'poorly drawn hands', 'poorly drawn face', 'mutation', 'ugly',
            'cropped', 'worst quality', 'low resolution', 'jpeg artifacts',
            'watermark', 'text', 'username', 'logo', 'signature'
        ])
    
    def _generate_suggestions(self, product_type):
        """Generate prompt suggestions"""
        suggestions = {
            'clothing': [
                'Try: "urban street style photoshoot" for edgy look',
                'Try: "luxury fashion editorial" for high-end appeal',
                'Try: "casual lifestyle moment" for relatable vibe'
            ],
            'footwear': [
                'Try: "walking shot, motion blur" for dynamic feel',
                'Try: "studio shot with dramatic lighting" for focus',
                'Try: "outdoor adventure setting" for lifestyle'
            ],
            'accessories': [
                'Try: "closeup with elegant hands" for luxury',
                'Try: "lifestyle moment in use" for context',
                'Try: "flat lay editorial" for style'
            ],
            'electronics': [
                'Try: "unboxing moment" for authenticity',
                'Try: "workspace setup" for lifestyle',
                'Try: "product review setup" for reviews'
            ],
            'cosmetics': [
                'Try: "before and after" for impact',
                'Try: "application tutorial" for engagement',
                'Try: "glamour shot results" for appeal'
            ]
        }
        
        return suggestions.get(product_type, [
            'Try: "lifestyle scene with natural lighting"',
            'Try: "professional product showcase"',
            'Try: "candid moment with product"'
        ])
    
    def optimize_for_generator(self, prompt, generator='stable-diffusion'):
        """Optimize prompt for specific generator"""
        if generator == 'midjourney':
            return prompt.replace(',', ' ::') + ' --ar 3:4 --style raw --s 250'
        elif generator == 'dalle':
            return prompt.replace(',', ' and')
        return prompt

# Singleton instance
prompt_builder = PromptBuilderService()
