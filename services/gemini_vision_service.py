"""
Gemini Vision Service - Google Gemini 1.5 Flash for Product Image Analysis
"""
import os
import requests
import base64
import json
import re

class GeminiVisionService:
    def __init__(self):
        self.api_key = os.getenv('GEMINI_API_KEY', '')
        self.base_url = 'https://generativelanguage.googleapis.com/v1beta/models'
        self.model = 'gemini-1.5-flash'
        
    def analyze_product_image(self, image_data, target_audience=''):
        """
        Analyze product image using Gemini 1.5 Flash Vision
        """
        try:
            # Clean base64 data
            if isinstance(image_data, bytes):
                base64_image = base64.b64encode(image_data).decode('utf-8')
            else:
                base64_image = image_data.replace('data:image/jpeg;base64,', '')
                base64_image = base64_image.replace('data:image/png;base64,', '')
                base64_image = base64_image.replace('data:image/webp;base64,', '')
            
            # Build prompt
            prompt = self._build_analysis_prompt(target_audience)
            
            # Call Gemini API
            analysis = self._call_gemini_api(base64_image, prompt)
            
            # Parse and structure response
            return self._parse_analysis(analysis)
            
        except Exception as e:
            print(f"Gemini Vision Error: {str(e)}")
            raise Exception(f"Failed to analyze image with Gemini: {str(e)}")
    
    def _build_analysis_prompt(self, target_audience):
        """Build analysis prompt for Gemini"""
        base_prompt = """Analyze this product image in detail and provide:

1. PRODUCT TYPE: Identify the exact category (clothing, footwear, electronics, cosmetics, accessories, home goods, sports equipment, etc.)
2. KEY FEATURES: Describe:
   - Primary colors (be specific, e.g., "navy blue", "rose gold")
   - Style (modern, classic, minimalist, bold, elegant, casual, professional)
   - Material/texture (if visible)
   - Design elements (patterns, shapes, decorations)
3. VISUAL CHARACTERISTICS:
   - Overall aesthetic (sleek, rustic, luxurious, sporty, etc.)
   - Notable details (unique features, branding, special finishes)
4. SUGGESTED USE: Brief context of where/how this product is used

Be specific and descriptive. Focus on visual details that would help generate AI prompts."""

        if target_audience.strip():
            return f"{base_prompt}\n\nTARGET AUDIENCE: {target_audience}\nAdjust analysis to emphasize features relevant to this audience."
        
        return base_prompt
    
    def _call_gemini_api(self, base64_image, prompt):
        """Call Google Gemini Vision API"""
        url = f"{self.base_url}/{self.model}:generateContent?key={self.api_key}"
        
        # Gemini API format
        payload = {
            "contents": [{
                "parts": [
                    {"text": prompt},
                    {
                        "inline_data": {
                            "mime_type": "image/jpeg",
                            "data": base64_image
                        }
                    }
                ]
            }],
            "generationConfig": {
                "temperature": 0.4,
                "maxOutputTokens": 1000
            }
        }
        
        headers = {
            'Content-Type': 'application/json'
        }
        
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            # Extract text from Gemini response
            try:
                text = result['candidates'][0]['content']['parts'][0]['text']
                return text
            except (KeyError, IndexError) as e:
                raise Exception(f"Failed to parse Gemini response: {str(e)}")
        else:
            raise Exception(f"Gemini API Error: {response.status_code} - {response.text}")
    
    def _parse_analysis(self, raw_response):
        """Parse and structure Gemini analysis"""
        try:
            return {
                'rawAnalysis': raw_response,
                'productType': self._extract_product_type(raw_response),
                'features': self._extract_features(raw_response),
                'style': self._extract_style(raw_response),
                'colors': self._extract_colors(raw_response),
                'material': self._extract_material(raw_response),
                'confidence': 'high'
            }
        except Exception as e:
            print(f"Parse Error: {str(e)}")
            return {
                'rawAnalysis': raw_response,
                'productType': 'general product',
                'features': ['Analysis available in raw response'],
                'style': 'contemporary',
                'colors': [],
                'material': 'unknown',
                'confidence': 'medium'
            }
    
    def _extract_product_type(self, text):
        """Extract product category"""
        product_keywords = {
            'clothing': ['shirt', 't-shirt', 'dress', 'jacket', 'coat', 'pants', 'jeans', 'sweater', 'hoodie', 'blouse'],
            'footwear': ['shoes', 'sneakers', 'boots', 'sandals', 'heels', 'slippers'],
            'accessories': ['bag', 'handbag', 'backpack', 'watch', 'jewelry', 'sunglasses', 'hat', 'belt', 'scarf'],
            'electronics': ['phone', 'smartphone', 'laptop', 'tablet', 'headphones', 'camera', 'speaker'],
            'cosmetics': ['lipstick', 'makeup', 'perfume', 'skincare', 'foundation', 'mascara'],
            'home_goods': ['furniture', 'lamp', 'pillow', 'decor', 'vase', 'cushion'],
            'sports': ['yoga mat', 'dumbbell', 'fitness', 'sports equipment']
        }
        
        text_lower = text.lower()
        for category, keywords in product_keywords.items():
            if any(keyword in text_lower for keyword in keywords):
                return category
        
        return 'general product'
    
    def _extract_colors(self, text):
        """Extract color information"""
        color_pattern = r'\b(red|blue|green|yellow|black|white|gray|grey|pink|purple|orange|brown|beige|navy|gold|silver|rose|turquoise|burgundy|maroon|teal)\b'
        matches = re.findall(color_pattern, text, re.IGNORECASE)
        return list(set([c.lower() for c in matches]))[:5]
    
    def _extract_style(self, text):
        """Extract style keywords"""
        styles = [
            'modern', 'classic', 'vintage', 'minimalist', 'elegant', 'casual', 
            'professional', 'sporty', 'luxury', 'rustic', 'contemporary', 'bold',
            'sleek', 'traditional', 'artistic'
        ]
        text_lower = text.lower()
        
        for style in styles:
            if style in text_lower:
                return style
        
        return 'contemporary'
    
    def _extract_material(self, text):
        """Extract material information"""
        materials = [
            'cotton', 'leather', 'silk', 'wool', 'polyester', 'denim', 
            'metal', 'plastic', 'wood', 'glass', 'ceramic', 'fabric'
        ]
        text_lower = text.lower()
        
        for material in materials:
            if material in text_lower:
                return material
        
        return 'mixed materials'
    
    def _extract_features(self, text):
        """Extract key features as bullet points"""
        features = []
        
        # Split by common section markers
        sections = re.split(r'\n\d+\.|\n-|\n•', text)
        
        for section in sections:
            section = section.strip()
            # Get sentences between 20-150 chars
            if 20 < len(section) < 150 and not section.startswith('PRODUCT TYPE'):
                features.append(section)
        
        return features[:5] if features else ['Detailed analysis available in raw response']
    
    def health_check(self):
        """Check if Gemini API is available"""
        try:
            if not self.api_key:
                return {
                    'status': 'error',
                    'provider': 'Gemini Vision',
                    'model': self.model,
                    'available': False,
                    'error': 'API key not configured'
                }
            
            return {
                'status': 'ok',
                'provider': 'Gemini Vision',
                'model': self.model,
                'available': True
            }
        except Exception as e:
            return {
                'status': 'error',
                'provider': 'Gemini Vision',
                'model': self.model,
                'available': False,
                'error': str(e)
            }

# Singleton instance
gemini_vision_service = GeminiVisionService()
