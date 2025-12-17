from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os
import sys
import requests
import base64

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder='public', static_url_path='')
CORS(app)

# Get API keys from environment
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
GROK_API_KEY = os.getenv('GROK_API_KEY')

# Serve static files
@app.route('/')
def index():
    return send_from_directory('public', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('public', path)

# API endpoints
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
                            'image_url': {
                                'url': image_data
                            }
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

@app.route('/api/generate', methods=['POST'])
def generate():
    """DALL-E 3 Image Generation"""
    try:
        data = request.json
        api_key = data.get('apiKey')
        prompt = data.get('prompt')
        n = data.get('n', 1)
        
        if not api_key or not prompt:
            return jsonify({'error': 'Thiếu API key hoặc prompt'}), 400
        
        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'model': 'dall-e-3',
            'prompt': prompt,
            'n': min(n, 1),  # DALL-E 3 only supports n=1
            'size': '1024x1024',
            'quality': 'standard'
        }
        
        response = requests.post(
            'https://api.openai.com/v1/images/generations',
            headers=headers,
            json=payload,
            timeout=60
        )
        
        if response.status_code == 200:
            result = response.json()
            images = [img['url'] for img in result['data']]
            return jsonify({'images': images})
        else:
            return jsonify({'error': response.text}), response.status_code
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/gemini-analyze', methods=['POST'])
def gemini_analyze():
    """Google Gemini AI Analysis - Sử dụng API key từ server"""
    try:
        data = request.json
        image_data = data.get('image')
        use_server_key = data.get('useServerKey', True)
        
        # Sử dụng API key từ server hoặc từ client
        api_key = GEMINI_API_KEY if use_server_key else data.get('apiKey')
        
        if not api_key or not image_data:
            return jsonify({'error': 'Thiếu API key hoặc hình ảnh'}), 400
        
        # Convert base64 to proper format for Gemini
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}'
        
        payload = {
            'contents': [{
                'parts': [
                    {'text': 'Phân tích chi tiết hình ảnh sản phẩm này bằng tiếng Việt. Cung cấp thông tin về: 1) Mô tả sản phẩm, 2) Đặc điểm nổi bật, 3) Đối tượng khách hàng mục tiêu, 4) Đề xuất chiến lược marketing, 5) Gợi ý cải thiện hình ảnh.'},
                    {
                        'inline_data': {
                            'mime_type': 'image/jpeg',
                            'data': image_data
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
    """xAI Grok Analysis - Sử dụng API key từ server"""
    try:
        data = request.json
        image_data = data.get('image')
        text_query = data.get('query', 'Phân tích chi tiết hình ảnh sản phẩm này')
        use_server_key = data.get('useServerKey', True)
        
        # Sử dụng API key từ server hoặc từ client
        api_key = GROK_API_KEY if use_server_key else data.get('apiKey')
        
        if not api_key:
            return jsonify({'error': 'Thiếu API key'}), 400
        
        # Grok API endpoint
        url = 'https://api.x.ai/v1/chat/completions'
        
        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
        
        # Prepare messages
        messages = [
            {
                'role': 'system',
                'content': 'Bạn là trợ lý AI chuyên nghiệp về phân tích sản phẩm và marketing. Hãy trả lời bằng tiếng Việt một cách chi tiết và chuyên nghiệp.'
            },
            {
                'role': 'user',
                'content': text_query
            }
        ]
        
        # If image provided, include it (Grok supports vision)
        if image_data:
            messages[1]['content'] = [
                {'type': 'text', 'text': text_query},
                {'type': 'image_url', 'image_url': {'url': image_data}}
            ]
        
        payload = {
            'model': 'grok-vision-beta',
            'messages': messages,
            'max_tokens': 2000,
            'temperature': 0.7
        }
        
        response = requests.post(url, headers=headers, json=payload, timeout=60)
        
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

@app.route('/api/multi-analyze', methods=['POST'])
def multi_analyze():
    """Multi-AI Analysis - Phân tích đồng thời với nhiều AI"""
    try:
        data = request.json
        image_data = data.get('image')
        providers = data.get('providers', ['gemini', 'grok'])
        openai_key = data.get('openaiKey')
        
        if not image_data:
            return jsonify({'error': 'Thiếu hình ảnh'}), 400
        
        results = {}
        
        # Gemini Analysis
        if 'gemini' in providers and GEMINI_API_KEY:
            try:
                gemini_result = gemini_analyze_internal(image_data, GEMINI_API_KEY)
                results['gemini'] = gemini_result
            except Exception as e:
                results['gemini'] = {'error': str(e)}
        
        # Grok Analysis
        if 'grok' in providers and GROK_API_KEY:
            try:
                grok_result = grok_analyze_internal(image_data, GROK_API_KEY)
                results['grok'] = grok_result
            except Exception as e:
                results['grok'] = {'error': str(e)}
        
        # OpenAI Analysis (if key provided)
        if 'openai' in providers and openai_key:
            try:
                openai_result = openai_analyze_internal(image_data, openai_key)
                results['openai'] = openai_result
            except Exception as e:
                results['openai'] = {'error': str(e)}
        
        return jsonify({
            'results': results,
            'timestamp': str(sys.maxsize)
        })
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Internal helper functions
def gemini_analyze_internal(image_data, api_key):
    """Internal Gemini analysis"""
    if ',' in image_data:
        image_data = image_data.split(',')[1]
    
    url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}'
    
    payload = {
        'contents': [{
            'parts': [
                {'text': 'Phân tích chi tiết hình ảnh sản phẩm này bằng tiếng Việt. Cung cấp thông tin về sản phẩm, đặc điểm, và đề xuất marketing.'},
                {
                    'inline_data': {
                        'mime_type': 'image/jpeg',
                        'data': image_data
                    }
                }
            ]
        }]
    }
    
    response = requests.post(url, json=payload, timeout=60)
    
    if response.status_code == 200:
        result = response.json()
        return {
            'analysis': result['candidates'][0]['content']['parts'][0]['text'],
            'model': 'gemini-1.5-flash'
        }
    else:
        raise Exception(response.text)

def grok_analyze_internal(image_data, api_key):
    """Internal Grok analysis"""
    url = 'https://api.x.ai/v1/chat/completions'
    
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }
    
    payload = {
        'model': 'grok-vision-beta',
        'messages': [
            {
                'role': 'system',
                'content': 'Bạn là trợ lý AI chuyên về phân tích sản phẩm. Trả lời bằng tiếng Việt.'
            },
            {
                'role': 'user',
                'content': [
                    {'type': 'text', 'text': 'Phân tích hình ảnh sản phẩm này một cách chi tiết'},
                    {'type': 'image_url', 'image_url': {'url': image_data}}
                ]
            }
        ],
        'max_tokens': 2000
    }
    
    response = requests.post(url, headers=headers, json=payload, timeout=60)
    
    if response.status_code == 200:
        result = response.json()
        return {
            'analysis': result['choices'][0]['message']['content'],
            'model': 'grok-vision-beta'
        }
    else:
        raise Exception(response.text)

def openai_analyze_internal(image_data, api_key):
    """Internal OpenAI analysis"""
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
                        'text': 'Phân tích chi tiết hình ảnh sản phẩm này bằng tiếng Việt'
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
        return {
            'analysis': result['choices'][0]['message']['content'],
            'model': 'gpt-4-vision-preview'
        }
    else:
        raise Exception(response.text)

@app.route('/api/canvas-generate', methods=['POST'])
def canvas_generate():
    """Canvas-based Image Generation"""
    try:
        data = request.json
        prompt = data.get('prompt', 'Hình ảnh sản phẩm')
        
        # Simple canvas generation response
        return jsonify({
            'images': [
                f'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgZmlsbD0iI2Y1ZjVmNSIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5DYW52YXMgR2VuZXJhdGVkPC90ZXh0Pgo8L3N2Zz4='
            ]
        })
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health')
def health():
    return jsonify({
        'status': 'ok', 
        'message': 'Flask server đang chạy',
        'gemini_key': 'configured' if GEMINI_API_KEY else 'missing',
        'grok_key': 'configured' if GROK_API_KEY else 'missing'
    })

@app.route('/api/config')
def api_config():
    """Trả về thông tin API keys có sẵn"""
    return jsonify({
        'gemini': bool(GEMINI_API_KEY),
        'grok': bool(GROK_API_KEY),
        'providers': [
            {'id': 'gemini', 'name': 'Google Gemini', 'available': bool(GEMINI_API_KEY)},
            {'id': 'grok', 'name': 'xAI Grok', 'available': bool(GROK_API_KEY)},
            {'id': 'openai', 'name': 'OpenAI GPT-4', 'available': False, 'requiresKey': True}
        ]
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    host = os.environ.get('HOST', '0.0.0.0')
    debug = os.environ.get('DEBUG', 'false').lower() == 'true'
    
    print(f"""
    ╔═══════════════════════════════════════════════════════╗
    ║  🎨 AI Product Analyzer V4 Pro 2025                  ║
    ║  Flask Server với Gemini + Grok + OpenAI             ║
    ╚═══════════════════════════════════════════════════════╝
    
    🌐 Server: http://{host}:{port}
    📁 Static: /home/root/webapp/public
    🔧 Debug: {debug}
    
    🔑 API Keys Status:
       {'✅' if GEMINI_API_KEY else '❌'} Gemini API Key: {'Đã cấu hình' if GEMINI_API_KEY else 'Chưa có'}
       {'✅' if GROK_API_KEY else '❌'} Grok API Key: {'Đã cấu hình' if GROK_API_KEY else 'Chưa có'}
    
    📋 Endpoints:
       GET  /                     - Homepage (V4 Pro)
       GET  /v4.html              - V4 Pro 2025 Edition
       POST /api/gemini-analyze   - Google Gemini AI (Server Key)
       POST /api/grok-analyze     - xAI Grok (Server Key)
       POST /api/multi-analyze    - Multi-AI Analysis
       POST /api/analyze          - OpenAI GPT-4 Vision (Client Key)
       POST /api/generate         - DALL-E 3 (Client Key)
       GET  /api/config           - API Configuration
       GET  /health               - Health check
    
    ✅ Server sẵn sàng nhận requests!
    """)
    
    app.run(host=host, port=port, debug=debug)
