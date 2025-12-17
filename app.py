"""
AI Product Analyzer - Unified Flask Application
Combines image analysis and prompt generation features
"""
from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os
import sys
import requests
import base64
import traceback

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__, static_folder='public', static_url_path='')
CORS(app)

# Get API keys
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
GROK_API_KEY = os.getenv('GROK_API_KEY')

# Import services
try:
    sys.path.insert(0, os.path.dirname(__file__))
    # Try Gemini Vision first (more reliable)
    from services.gemini_vision_service import gemini_vision_service
    from services.prompt_builder import prompt_builder
    from utils.image_processor import image_processor
    AI_SERVICE_AVAILABLE = True
    print("✅ AI services loaded successfully (Gemini Vision)")
except ImportError as e:
    AI_SERVICE_AVAILABLE = False
    print(f"⚠️ AI services not available: {e}")

# ============================================================================
# STATIC FILE SERVING
# ============================================================================

@app.route('/')
def index():
    """Serve main page"""
    return send_from_directory('public', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    """Serve static files"""
    try:
        return send_from_directory('public', path)
    except:
        return send_from_directory('public', 'index.html')

# ============================================================================
# HEALTH & CONFIG ENDPOINTS
# ============================================================================

@app.route('/api/health')
def health():
    """Health check endpoint"""
    health_data = {
        'status': 'ok',
        'message': 'Flask server đang chạy',
        'gemini_key': 'configured' if GEMINI_API_KEY else 'not_configured',
        'grok_key': 'configured' if GROK_API_KEY else 'not_configured',
        'ai_service': 'available' if AI_SERVICE_AVAILABLE else 'unavailable'
    }
    
    if AI_SERVICE_AVAILABLE:
        ai_health = gemini_vision_service.health_check()
        health_data['vision_api'] = ai_health
    
    return jsonify(health_data)

@app.route('/api/config')
def config():
    """Get API configuration"""
    return jsonify({
        'gemini': bool(GEMINI_API_KEY),
        'grok': bool(GROK_API_KEY),
        'ai_service': AI_SERVICE_AVAILABLE,
        'providers': ['gemini', 'grok', 'openai', 'huggingface']
    })

# ============================================================================
# IMAGE ANALYSIS ENDPOINTS (Existing Features)
# ============================================================================

@app.route('/api/analyze', methods=['POST'])
def analyze():
    """OpenAI GPT-4 Vision Analysis"""
    try:
        data = request.json
        api_key = data.get('apiKey')
        image_data = data.get('image')
        
        if not api_key or not image_data:
            return jsonify({'error': 'Thiếu API key hoặc hình ảnh'}), 400
        
        # Call OpenAI API
        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'model': 'gpt-4-vision-preview',
            'messages': [
                {
                    'role': 'user',
                    'content': [
                        {
                            'type': 'text',
                            'text': 'Phân tích chi tiết hình ảnh sản phẩm này. Cung cấp thông tin về đặc điểm sản phẩm, đối tượng mục tiêu, và đề xuất marketing.'
                        },
                        {
                            'type': 'image_url',
                            'image_url': {'url': image_data}
                        }
                    ]
                }
            ],
            'max_tokens': 1500
        }
        
        response = requests.post(
            'https://api.openai.com/v1/chat/completions',
            headers=headers,
            json=payload,
            timeout=60
        )
        
        if response.status_code == 200:
            result = response.json()
            analysis = result['choices'][0]['message']['content']
            return jsonify({
                'analysis': analysis,
                'provider': 'openai',
                'model': 'gpt-4-vision-preview'
            })
        else:
            return jsonify({'error': response.text}), response.status_code
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/gemini-analyze', methods=['POST'])
def gemini_analyze():
    """Google Gemini 1.5 Flash Analysis"""
    try:
        data = request.json
        api_key = data.get('apiKey', GEMINI_API_KEY)
        image_data = data.get('image')
        
        if not api_key:
            return jsonify({'error': 'Thiếu Gemini API key'}), 400
        
        if not image_data:
            return jsonify({'error': 'Thiếu hình ảnh'}), 400
        
        # Extract base64 data
        if 'base64,' in image_data:
            base64_data = image_data.split('base64,')[1]
        else:
            base64_data = image_data
        
        # Call Gemini API
        url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}'
        
        payload = {
            'contents': [{
                'parts': [
                    {'text': 'Phân tích chi tiết sản phẩm trong hình ảnh này. Bao gồm: 1) Mô tả sản phẩm, 2) Đặc điểm nổi bật, 3) Đối tượng khách hàng mục tiêu, 4) Chiến lược marketing, 5) Gợi ý cải thiện hình ảnh.'},
                    {
                        'inline_data': {
                            'mime_type': 'image/jpeg',
                            'data': base64_data
                        }
                    }
                ]
            }]
        }
        
        response = requests.post(url, json=payload, timeout=60)
        
        if response.status_code == 200:
            result = response.json()
            analysis = result['candidates'][0]['content']['parts'][0]['text']
            return jsonify({
                'analysis': analysis,
                'provider': 'gemini',
                'model': 'gemini-1.5-flash'
            })
        else:
            return jsonify({'error': response.text}), response.status_code
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/grok-analyze', methods=['POST'])
def grok_analyze():
    """xAI Grok Vision Analysis"""
    try:
        data = request.json
        api_key = data.get('apiKey', GROK_API_KEY)
        image_data = data.get('image')
        
        if not api_key:
            return jsonify({'error': 'Thiếu Grok API key'}), 400
        
        if not image_data:
            return jsonify({'error': 'Thiếu hình ảnh'}), 400
        
        # Call Grok API
        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'model': 'grok-vision-beta',
            'messages': [
                {
                    'role': 'system',
                    'content': 'Bạn là chuyên gia phân tích sản phẩm và marketing. Phân tích hình ảnh một cách chi tiết và chuyên nghiệp.'
                },
                {
                    'role': 'user',
                    'content': [
                        {
                            'type': 'image_url',
                            'image_url': {'url': image_data}
                        },
                        {
                            'type': 'text',
                            'text': 'Phân tích sản phẩm: 1) Mô tả chi tiết, 2) Đặc điểm, 3) Target audience, 4) Marketing strategy, 5) Cải thiện hình ảnh'
                        }
                    ]
                }
            ],
            'temperature': 0.7,
            'max_tokens': 2000
        }
        
        response = requests.post(
            'https://api.x.ai/v1/chat/completions',
            headers=headers,
            json=payload,
            timeout=60
        )
        
        if response.status_code == 200:
            result = response.json()
            analysis = result['choices'][0]['message']['content']
            return jsonify({
                'analysis': analysis,
                'provider': 'grok',
                'model': 'grok-vision-beta'
            })
        else:
            return jsonify({'error': response.text}), response.status_code
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/dalle-generate', methods=['POST'])
def dalle_generate():
    """DALL-E 3 Image Generation"""
    try:
        data = request.json
        api_key = data.get('apiKey')
        prompt = data.get('prompt')
        
        if not api_key or not prompt:
            return jsonify({'error': 'Thiếu API key hoặc prompt'}), 400
        
        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'model': 'dall-e-3',
            'prompt': prompt,
            'n': 1,
            'size': '1024x1024',
            'quality': 'standard'
        }
        
        response = requests.post(
            'https://api.openai.com/v1/images/generations',
            headers=headers,
            json=payload,
            timeout=120
        )
        
        if response.status_code == 200:
            result = response.json()
            return jsonify({
                'imageUrl': result['data'][0]['url'],
                'revisedPrompt': result['data'][0].get('revised_prompt', prompt)
            })
        else:
            return jsonify({'error': response.text}), response.status_code
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================================================
# AI PROMPT GENERATOR ENDPOINTS (New Feature)
# ============================================================================

@app.route('/api/generate-prompt', methods=['POST'])
def generate_prompt():
    """
    Generate AI image generation prompt from product image
    Accepts: image (base64), targetAudience (optional), generator (optional)
    """
    try:
        if not AI_SERVICE_AVAILABLE:
            return jsonify({
                'success': False,
                'error': 'AI service not available. Please configure Hugging Face API token.'
            }), 503
        
        data = request.json
        image_data = data.get('image')
        target_audience = data.get('targetAudience', '')
        generator = data.get('generator', 'stable-diffusion')
        
        if not image_data:
            return jsonify({
                'success': False,
                'error': 'No image provided'
            }), 400
        
        # Validate image
        print("Validating image...")
        validation = image_processor.validate_image(image_data)
        if not validation['valid']:
            return jsonify({
                'success': False,
                'error': f"Invalid image: {validation.get('error', 'Unknown error')}"
            }), 400
        
        # Process image
        print("Processing image...")
        processed_image = image_processor.process_image(image_data)
        
        # Analyze with AI (Gemini Vision)
        print("Analyzing product image with Gemini Vision...")
        analysis = gemini_vision_service.analyze_product_image(processed_image, target_audience)
        
        # Generate prompt
        print("Building optimized prompt...")
        prompt_data = prompt_builder.generate_prompt(analysis, target_audience)
        
        # Optimize for specific generator
        if generator != 'stable-diffusion':
            prompt_data['prompt'] = prompt_builder.optimize_for_generator(
                prompt_data['prompt'], 
                generator
            )
        
        # Return response
        return jsonify({
            'success': True,
            'data': {
                'prompt': prompt_data['prompt'],
                'negativePrompt': prompt_data['negativePrompt'],
                'metadata': {
                    **prompt_data['metadata'],
                    'generator': generator,
                    'imageSize': validation['size'],
                    'imageDimensions': {
                        'width': validation['width'],
                        'height': validation['height']
                    }
                },
                'suggestions': prompt_data['suggestions'],
                'analysis': {
                    'productType': analysis['productType'],
                    'detectedColors': analysis['colors'],
                    'style': analysis['style'],
                    'confidence': analysis['confidence']
                }
            },
            'timestamp': None
        })
        
    except Exception as e:
        print(f"Error in generate_prompt: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/supported-types', methods=['GET'])
def supported_types():
    """Get supported product types"""
    types = [
        {
            'type': 'clothing',
            'examples': ['shirts', 't-shirts', 'dresses', 'jackets', 'pants'],
            'strategy': 'Full body modeling shot'
        },
        {
            'type': 'footwear',
            'examples': ['shoes', 'sneakers', 'boots', 'sandals'],
            'strategy': 'Full body with footwear focus'
        },
        {
            'type': 'accessories',
            'examples': ['bags', 'watches', 'jewelry', 'sunglasses'],
            'strategy': 'Close-up modeling or lifestyle'
        },
        {
            'type': 'electronics',
            'examples': ['phones', 'laptops', 'headphones', 'cameras'],
            'strategy': 'Lifestyle hands-on demonstration'
        },
        {
            'type': 'cosmetics',
            'examples': ['makeup', 'skincare', 'perfumes'],
            'strategy': 'Beauty application shot'
        },
        {
            'type': 'home_goods',
            'examples': ['furniture', 'decor', 'lighting'],
            'strategy': 'Lifestyle scene integration'
        },
        {
            'type': 'sports',
            'examples': ['fitness equipment', 'athletic wear'],
            'strategy': 'Action/fitness modeling'
        }
    ]
    
    return jsonify({
        'success': True,
        'supportedTypes': types,
        'totalCategories': len(types)
    })

# ============================================================================
# ERROR HANDLERS
# ============================================================================

@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify({'error': 'Internal server error'}), 500

# ============================================================================
# MAIN
# ============================================================================

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    print(f"\n{'='*60}")
    print(f"🚀 AI Product Analyzer - Starting Server")
    print(f"{'='*60}")
    print(f"📍 Port: {port}")
    print(f"🌍 Environment: {os.getenv('NODE_ENV', 'development')}")
    print(f"✅ Gemini API: {'Configured' if GEMINI_API_KEY else 'Not configured'}")
    print(f"✅ Grok API: {'Configured' if GROK_API_KEY else 'Not configured'}")
    print(f"🤖 AI Service: {'Available' if AI_SERVICE_AVAILABLE else 'Unavailable'}")
    print(f"\n📝 Available Endpoints:")
    print(f"   • GET  /                      - Main application")
    print(f"   • GET  /api/health            - Health check")
    print(f"   • GET  /api/config            - API configuration")
    print(f"   • POST /api/analyze           - GPT-4 Vision analysis")
    print(f"   • POST /api/gemini-analyze    - Gemini analysis")
    print(f"   • POST /api/grok-analyze      - Grok analysis")
    print(f"   • POST /api/dalle-generate    - DALL-E generation")
    print(f"   • POST /api/generate-prompt   - 🆕 AI Prompt Generator")
    print(f"   • GET  /api/supported-types   - 🆕 Supported products")
    print(f"{'='*60}\n")
    print(f"✅ Server sẵn sàng nhận requests!\n")
    
    app.run(host='0.0.0.0', port=port, debug=False)
