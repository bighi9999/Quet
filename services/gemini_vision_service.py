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
        
    def analyze_product_image(self, image_data, target_audience='', generate_marketing=False):
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
            result = self._parse_analysis(analysis)
            
            # Generate marketing content if requested
            if generate_marketing:
                marketing_content = self.generate_marketing_content(base64_image, result)
                result['marketingContent'] = marketing_content
            
            return result
            
        except Exception as e:
            print(f"Gemini Vision Error: {str(e)}")
            raise Exception(f"Failed to analyze image with Gemini: {str(e)}")
    
    def generate_marketing_content(self, base64_image, product_analysis):
        """
        Generate 3 styles of marketing content in Vietnamese
        """
        try:
            prompt = self._build_marketing_prompt(product_analysis)
            raw_content = self._call_gemini_api(base64_image, prompt, max_tokens=2000)
            return self._parse_marketing_content(raw_content)
        except Exception as e:
            print(f"Marketing Content Generation Error: {str(e)}")
            return {
                'shopee': 'Nội dung quảng cáo đang được tạo...',
                'facebook': 'Nội dung quảng cáo đang được tạo...',
                'instagram': 'Nội dung quảng cáo đang được tạo...'
            }
    
    def _build_marketing_prompt(self, product_analysis):
        """Build marketing content generation prompt"""
        product_type = product_analysis.get('productType', 'sản phẩm')
        features = ', '.join(product_analysis.get('features', [])[:3])
        style = product_analysis.get('style', 'hiện đại')
        
        prompt = f"""Bạn là chuyên gia Marketing với 10 năm kinh nghiệm. Hãy viết 3 đoạn nội dung quảng cáo BẰNG TIẾNG VIỆT cho sản phẩm này:

THÔNG TIN SẢN PHẨM:
- Loại: {product_type}
- Đặc điểm: {features}
- Phong cách: {style}

YÊU CẦU VIẾT 3 PHONG CÁCH (Mỗi phong cách 1 đoạn riêng biệt):

[STYLE 1: SHOPEE/E-COMMERCE]
- Tiêu đề: Bắt mắt, chèn emoji liên quan (🔥💥✨🎁)
- Nội dung: Liệt kê tính năng dạng gạch đầu dòng (✅ hoặc 👉)
- Highlight: Giá trị, ưu đãi, chất lượng
- Kết thúc: CTA mạnh mẽ (ĐẶT NGAY, MUA NGAY, INBOX)
- Độ dài: 100-150 từ

[STYLE 2: FACEBOOK/TIKTOK]
- Mở đầu: Câu hỏi hoặc tình huống gây tò mò
- Nội dung: Kể chuyện, tạo cảm xúc, bắt trend
- Emoji: Nhiều, đa dạng, phù hợp nội dung
- Giọng điệu: Thân thiện, gần gũi, trẻ trung
- Kết thúc: Tương tác (Tag bạn bè, Comment, Share)
- Độ dài: 120-180 từ

[STYLE 3: INSTAGRAM/LUXURY]
- Mở đầu: Câu ngắn gọn, sâu sắc, triết lý
- Nội dung: Tập trung giá trị tinh thần, lifestyle, mood
- Từ ngữ: Tinh tế, sang trọng, tối giản
- Emoji: Ít, chọn lọc (✨💫🌟)
- Hashtags: 5-7 hashtags tiếng Anh liên quan (#Fashion #Luxury #Style)
- Độ dài: 80-120 từ

QUAN TRỌNG:
- Mỗi style phải có header rõ ràng: [SHOPEE], [FACEBOOK], [INSTAGRAM]
- Viết HOÀN TOÀN bằng tiếng Việt (trừ hashtags Instagram)
- Đảm bảo nội dung hấp dẫn, thuyết phục, phù hợp từng nền tảng
- Sử dụng emoji phù hợp với từng style

Hãy viết ngay bây giờ:"""
        
        return prompt
    
    def _parse_marketing_content(self, raw_content):
        """Parse marketing content from Gemini response"""
        try:
            # Extract each style section
            shopee_match = re.search(r'\[SHOPEE\](.*?)(?=\[FACEBOOK\]|\[INSTAGRAM\]|$)', raw_content, re.DOTALL | re.IGNORECASE)
            facebook_match = re.search(r'\[FACEBOOK\](.*?)(?=\[SHOPEE\]|\[INSTAGRAM\]|$)', raw_content, re.DOTALL | re.IGNORECASE)
            instagram_match = re.search(r'\[INSTAGRAM\](.*?)(?=\[SHOPEE\]|\[FACEBOOK\]|$)', raw_content, re.DOTALL | re.IGNORECASE)
            
            return {
                'shopee': shopee_match.group(1).strip() if shopee_match else self._extract_first_paragraph(raw_content),
                'facebook': facebook_match.group(1).strip() if facebook_match else self._extract_middle_paragraph(raw_content),
                'instagram': instagram_match.group(1).strip() if instagram_match else self._extract_last_paragraph(raw_content)
            }
        except Exception as e:
            print(f"Parse Marketing Error: {str(e)}")
            # Fallback: Split by paragraphs
            paragraphs = [p.strip() for p in raw_content.split('\n\n') if p.strip() and len(p.strip()) > 50]
            return {
                'shopee': paragraphs[0] if len(paragraphs) > 0 else raw_content[:500],
                'facebook': paragraphs[1] if len(paragraphs) > 1 else raw_content[500:1000],
                'instagram': paragraphs[2] if len(paragraphs) > 2 else raw_content[1000:1500]
            }
    
    def _extract_first_paragraph(self, text):
        """Extract first substantial paragraph"""
        paragraphs = [p.strip() for p in text.split('\n\n') if len(p.strip()) > 50]
        return paragraphs[0] if paragraphs else text[:500]
    
    def _extract_middle_paragraph(self, text):
        """Extract middle paragraph"""
        paragraphs = [p.strip() for p in text.split('\n\n') if len(p.strip()) > 50]
        return paragraphs[len(paragraphs)//2] if len(paragraphs) > 1 else text[500:1000]
    
    def _extract_last_paragraph(self, text):
        """Extract last paragraph"""
        paragraphs = [p.strip() for p in text.split('\n\n') if len(p.strip()) > 50]
        return paragraphs[-1] if paragraphs else text[-500:]
    
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
    
    def _call_gemini_api(self, base64_image, prompt, max_tokens=1000, temperature=0.4):
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
                "temperature": temperature,
                "maxOutputTokens": max_tokens
            }
        }
        
        headers = {
            'Content-Type': 'application/json'
        }
        
        response = requests.post(url, headers=headers, json=payload, timeout=45)
        
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
