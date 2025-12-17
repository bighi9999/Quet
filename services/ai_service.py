"""
AI Service - Hugging Face Vision-Language Model Integration
"""
import os
import requests
import base64
import json
import time
import re

class AIService:
    def __init__(self):
        self.api_token = os.getenv('HUGGINGFACE_API_TOKEN', '')
        self.base_url = os.getenv('HUGGINGFACE_API_URL', 'https://router.huggingface.co/models')
        self.model = os.getenv('VISION_MODEL', 'llava-hf/llava-1.5-7b-hf')
        self.max_retries = 3
        self.retry_delay = 2
    
    def analyze_product_image(self, image_data, target_audience=''):
        """
        Analyze product image using Hugging Face Vision-Language Model
        """
        try:
            # Convert image to base64 if needed
            if isinstance(image_data, bytes):
                base64_image = base64.b64encode(image_data).decode('utf-8')
            else:
                base64_image = image_data.replace('data:image/jpeg;base64,', '')
                base64_image = base64_image.replace('data:image/png;base64,', '')
            
            # Build analysis prompt
            analysis_prompt = self._build_analysis_prompt(target_audience)
            
            # Call HF API with retry
            analysis = self._call_vision_model(base64_image, analysis_prompt)
            
            # Parse response
            return self._parse_analysis(analysis)
            
        except Exception as e:
            print(f"AI Service Error: {str(e)}")
            raise Exception(f"Failed to analyze image: {str(e)}")
    
    def _build_analysis_prompt(self, target_audience):
        """Build detailed analysis prompt"""
        base_prompt = """Analyze this product image in detail and provide:

1. PRODUCT TYPE: Identify the exact category (clothing, footwear, electronics, cosmetics, accessories, home goods, etc.)
2. KEY FEATURES: Describe color, style, material, design elements
3. VISUAL STYLE: Modern, classic, minimalist, bold, elegant, casual
4. NOTABLE DETAILS: Patterns, textures, unique features

Format your response clearly."""

        if target_audience.strip():
            return f"{base_prompt}\n\nTARGET AUDIENCE: {target_audience}"
        
        return base_prompt
    
    def _call_vision_model(self, base64_image, prompt, attempt=1):
        """Call Hugging Face API with retry logic"""
        try:
            url = f"{self.base_url}/{self.model}"
            headers = {
                'Authorization': f'Bearer {self.api_token}',
                'Content-Type': 'application/json'
            }
            
            payload = {
                "inputs": prompt,
                "parameters": {
                    "max_new_tokens": 500,
                    "temperature": 0.7
                }
            }
            
            # For vision models, include image data
            if 'llava' in self.model.lower() or 'vision' in self.model.lower():
                payload["inputs"] = {
                    "image": base64_image,
                    "prompt": prompt
                }
            
            response = requests.post(
                url,
                headers=headers,
                json=payload,
                timeout=60
            )
            
            if response.status_code == 200:
                result = response.json()
                if isinstance(result, list) and len(result) > 0:
                    return result[0].get('generated_text', str(result))
                return str(result)
            
            elif response.status_code == 503 and attempt < self.max_retries:
                print(f"Model loading, retry {attempt}/{self.max_retries}...")
                time.sleep(self.retry_delay * attempt)
                return self._call_vision_model(base64_image, prompt, attempt + 1)
            
            else:
                raise Exception(f"API Error: {response.status_code} - {response.text}")
                
        except Exception as e:
            if attempt < self.max_retries:
                time.sleep(self.retry_delay)
                return self._call_vision_model(base64_image, prompt, attempt + 1)
            raise e
    
    def _parse_analysis(self, raw_response):
        """Parse and structure the AI analysis response"""
        try:
            analysis = {
                'rawAnalysis': raw_response,
                'productType': self._extract_product_type(raw_response),
                'features': self._extract_features(raw_response),
                'style': self._extract_style(raw_response),
                'colors': self._extract_colors(raw_response),
                'material': self._extract_material(raw_response),
                'confidence': 'high'
            }
            return analysis
            
        except Exception as e:
            print(f"Parse Error: {str(e)}")
            return {
                'rawAnalysis': raw_response,
                'productType': 'general product',
                'features': [],
                'style': 'contemporary',
                'colors': [],
                'material': 'unknown',
                'confidence': 'low'
            }
    
    def _extract_product_type(self, text):
        """Extract product type from analysis"""
        product_keywords = {
            'clothing': ['shirt', 't-shirt', 'dress', 'jacket', 'coat', 'pants', 'jeans', 'sweater', 'hoodie'],
            'footwear': ['shoes', 'sneakers', 'boots', 'sandals', 'heels'],
            'accessories': ['bag', 'handbag', 'backpack', 'watch', 'jewelry', 'sunglasses', 'hat'],
            'electronics': ['phone', 'smartphone', 'laptop', 'tablet', 'headphones', 'camera'],
            'cosmetics': ['lipstick', 'makeup', 'perfume', 'skincare'],
            'home_goods': ['furniture', 'lamp', 'pillow', 'decor'],
            'sports': ['yoga mat', 'dumbbell', 'fitness']
        }
        
        text_lower = text.lower()
        for category, keywords in product_keywords.items():
            if any(keyword in text_lower for keyword in keywords):
                return category
        
        return 'general product'
    
    def _extract_colors(self, text):
        """Extract color information"""
        color_pattern = r'\b(red|blue|green|yellow|black|white|gray|grey|pink|purple|orange|brown|beige|navy|gold|silver)\b'
        matches = re.findall(color_pattern, text, re.IGNORECASE)
        return list(set([c.lower() for c in matches]))
    
    def _extract_style(self, text):
        """Extract style keywords"""
        styles = ['modern', 'classic', 'vintage', 'minimalist', 'elegant', 'casual', 'professional', 'sporty', 'luxury']
        text_lower = text.lower()
        
        for style in styles:
            if style in text_lower:
                return style
        
        return 'contemporary'
    
    def _extract_material(self, text):
        """Extract material information"""
        materials = ['cotton', 'leather', 'silk', 'wool', 'polyester', 'denim', 'metal', 'plastic', 'wood']
        text_lower = text.lower()
        
        for material in materials:
            if material in text_lower:
                return material
        
        return 'mixed materials'
    
    def _extract_features(self, text):
        """Extract key features as array"""
        features = []
        sentences = text.split('.')
        
        for sentence in sentences:
            sentence = sentence.strip()
            if 20 < len(sentence) < 100:
                features.append(sentence)
        
        return features[:5]
    
    def health_check(self):
        """Check if API is available"""
        try:
            if not self.api_token:
                return {
                    'status': 'error',
                    'model': self.model,
                    'available': False,
                    'error': 'API token not configured'
                }
            
            return {
                'status': 'ok',
                'model': self.model,
                'available': True
            }
            
        except Exception as e:
            return {
                'status': 'error',
                'model': self.model,
                'available': False,
                'error': str(e)
            }

# Singleton instance
ai_service = AIService()
