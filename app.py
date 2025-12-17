from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
import os
import sys

app = Flask(__name__, static_folder='public', static_url_path='')
CORS(app)

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
        import requests
        data = request.json
        api_key = data.get('apiKey')
        image_data = data.get('image')
        
        if not api_key or not image_data:
            return jsonify({'error': 'Missing apiKey or image'}), 400
        
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
                            'text': 'Analyze this product image and provide detailed insights about the product, its features, target audience, and marketing suggestions.'
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
            'max_tokens': 1000
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
                'prompts': [
                    f"Professional product photo of {analysis[:50]}...",
                    f"Minimalist design featuring {analysis[:50]}...",
                    f"Lifestyle shot of {analysis[:50]}..."
                ]
            })
        else:
            return jsonify({'error': response.text}), response.status_code
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/generate', methods=['POST'])
def generate():
    """DALL-E 3 Image Generation"""
    try:
        import requests
        data = request.json
        api_key = data.get('apiKey')
        prompt = data.get('prompt')
        n = data.get('n', 1)
        
        if not api_key or not prompt:
            return jsonify({'error': 'Missing apiKey or prompt'}), 400
        
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
    """Google Gemini AI Analysis"""
    try:
        import requests
        data = request.json
        api_key = data.get('apiKey')
        image_data = data.get('image')
        
        if not api_key or not image_data:
            return jsonify({'error': 'Missing apiKey or image'}), 400
        
        # Convert base64 to proper format for Gemini
        import base64
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}'
        
        payload = {
            'contents': [{
                'parts': [
                    {'text': 'Analyze this product image in detail. Provide insights about the product, features, target audience, and marketing suggestions.'},
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
                'prompts': [
                    f"Professional product photo based on: {analysis[:50]}...",
                    f"Creative design featuring: {analysis[:50]}...",
                    f"Marketing visual for: {analysis[:50]}..."
                ]
            })
        else:
            return jsonify({'error': response.text}), response.status_code
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/canvas-generate', methods=['POST'])
def canvas_generate():
    """Canvas-based Image Generation"""
    try:
        data = request.json
        prompt = data.get('prompt', 'Product Image')
        
        # Simple canvas generation response
        # In production, this would use actual image generation
        return jsonify({
            'images': [
                f'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgZmlsbD0iI2Y1ZjVmNSIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5DYW52YXMgR2VuZXJhdGVkPC90ZXh0Pgo8L3N2Zz4='
            ]
        })
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health')
def health():
    return jsonify({'status': 'ok', 'message': 'Flask server is running'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    host = os.environ.get('HOST', '0.0.0.0')
    debug = os.environ.get('DEBUG', 'false').lower() == 'true'
    
    print(f"""
    ╔═══════════════════════════════════════════════╗
    ║  🎨 AI Product Image Analyzer V3             ║
    ║  Flask Server Starting...                    ║
    ╚═══════════════════════════════════════════════╝
    
    🌐 Server: http://{host}:{port}
    📁 Static: /home/root/webapp/public
    🔧 Debug: {debug}
    
    📋 Endpoints:
       GET  /                  - Homepage (V3)
       GET  /v3.html           - V3 Multi-AI Edition
       GET  /v2.html           - V2 Pro Edition
       POST /api/analyze       - OpenAI GPT-4 Vision
       POST /api/generate      - DALL-E 3
       POST /api/gemini-analyze - Google Gemini
       POST /api/canvas-generate - Canvas Generation
       GET  /health            - Health check
    
    ✅ Ready to accept requests!
    """)
    
    app.run(host=host, port=port, debug=debug)
