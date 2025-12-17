# 🎯 AI Product Analyzer

**Unified web application for AI-powered product image analysis and prompt generation**

[![Production Ready](https://img.shields.io/badge/status-production-success)](http://14.225.210.195:5000)
[![Python](https://img.shields.io/badge/python-3.8+-blue)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/flask-3.0-green)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

**Live Demo**: [http://14.225.210.195:5000](http://14.225.210.195:5000)

---

## ✨ Features

### 🎨 AI Product Image Prompt Generator
Generate optimized prompts for AI image generators from product photos:
- **Automatic Analysis**: Vision-language AI detects product type, colors, style, features
- **Smart Prompts**: Creates detailed prompts for realistic human model scenes
- **Multi-Generator Support**: Optimized for Stable Diffusion, Midjourney, DALL·E
- **Audience Targeting**: Tailors prompts to specific demographics
- **Negative Prompts**: Automatically generates quality-control prompts

### 📊 Product Image Analysis
Comprehensive AI-powered product analysis:
- **Multi-AI Support**: Gemini 1.5 Flash, Grok Vision, GPT-4 Vision
- **Detailed Insights**: Product description, features, target audience
- **Marketing Strategy**: Actionable marketing recommendations
- **Image Improvement**: Suggestions for better product photography

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Hugging Face API token (free)
- Optional: Gemini API key, Grok API key, OpenAI API key

### Installation

```bash
# Clone repository
git clone https://github.com/bighi9999/Quet.git
cd Quet

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Run server
python app.py
```

Server will start at `http://localhost:5000`

---

## 📁 Project Structure

```
webapp/
├── app.py                      # Main Flask application
├── requirements.txt            # Python dependencies
├── .env                        # Environment configuration
│
├── services/                   # Business logic layer
│   ├── ai_service.py          # Hugging Face API integration
│   └── prompt_builder.py      # Prompt generation engine
│
├── utils/                      # Utility functions
│   └── image_processor.py     # Image processing (PIL)
│
└── public/                     # Frontend static files
    ├── index.html             # Main SPA interface
    ├── styles.css             # Modern gradient UI
    ├── app.js                 # Vanilla JavaScript
    └── v4.html                # Legacy analyzer (optional)
```

---

## 🔧 Configuration

### Environment Variables (.env)

```bash
# Hugging Face (Required for Prompt Generator)
HUGGINGFACE_API_TOKEN=hf_your_token_here
VISION_MODEL=llava-hf/llava-1.5-7b-hf

# Optional AI Services
GEMINI_API_KEY=your_gemini_key
GROK_API_KEY=your_grok_key

# Server
PORT=5000
NODE_ENV=production
```

### Get API Keys

1. **Hugging Face** (Free): [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. **Gemini** (Free): [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
3. **Grok**: [https://console.x.ai](https://console.x.ai)
4. **OpenAI**: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)

---

## 🎯 API Endpoints

### AI Prompt Generator

#### `POST /api/generate-prompt`
Generate AI image generation prompt from product image.

**Request:**
```json
{
  "image": "data:image/jpeg;base64,...",
  "targetAudience": "Female, 25-35 years old, urban lifestyle",
  "generator": "stable-diffusion"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "prompt": "Full body shot of professional female model...",
    "negativePrompt": "blurry, low quality, distorted...",
    "metadata": {
      "productType": "clothing",
      "style": "modern",
      "colors": ["red", "black"],
      "strategy": "full_body_modeling"
    },
    "suggestions": [
      "Try: 'urban street style photoshoot' for edgy look"
    ],
    "analysis": {
      "productType": "clothing",
      "detectedColors": ["red", "black"],
      "style": "modern",
      "confidence": "high"
    }
  }
}
```

#### `GET /api/supported-types`
Get list of supported product categories and strategies.

### Product Analysis

#### `POST /api/gemini-analyze`
Analyze product image with Google Gemini 1.5 Flash.

#### `POST /api/grok-analyze`
Analyze product image with xAI Grok Vision.

#### `POST /api/analyze`
Analyze product image with OpenAI GPT-4 Vision.

### Utility

#### `GET /api/health`
Health check and service status.

#### `GET /api/config`
Check available API configurations.

---

## 💻 Usage Examples

### 1. Generate Prompt for Clothing Product

```javascript
const formData = {
  image: "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  targetAudience: "Female, 25-35, urban lifestyle, fashion-conscious",
  generator: "stable-diffusion"
};

fetch('/api/generate-prompt', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
})
.then(res => res.json())
.then(data => {
  console.log('Main Prompt:', data.data.prompt);
  console.log('Negative Prompt:', data.data.negativePrompt);
});
```

### 2. Analyze Product with Gemini

```javascript
fetch('/api/gemini-analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    image: "data:image/jpeg;base64,...",
    apiKey: "your_gemini_key" // optional if set in .env
  })
})
.then(res => res.json())
.then(data => {
  console.log('Analysis:', data.analysis);
});
```

---

## 🎨 Frontend Features

### Modern Single-Page Application
- **Mode Switching**: Toggle between Prompt Generator and Product Analyzer
- **Drag & Drop**: Easy image upload with preview
- **Real-time Validation**: Character counter, file size/type checking
- **Responsive Design**: Works on desktop, tablet, mobile
- **Clean UI**: Modern gradient design with smooth animations

### User Experience
- **Progress Indicators**: Visual feedback during AI processing
- **One-Click Copy**: Copy prompts to clipboard instantly
- **Error Handling**: User-friendly error messages
- **Accessibility**: Keyboard navigation, semantic HTML

---

## 🛠️ Development

### Run in Development Mode

```bash
# Set debug mode
export FLASK_ENV=development

# Run with auto-reload
python app.py
```

### Tech Stack
- **Backend**: Flask 3.0, Python 3.8+
- **Frontend**: Vanilla JavaScript (no frameworks)
- **AI Services**: Hugging Face Inference API
- **Image Processing**: Pillow (PIL)
- **HTTP Client**: Requests

### Code Quality
- Modular architecture (services, utils)
- Type hints and docstrings
- Error handling and logging
- Environment-based configuration

---

## 🚀 Deployment

### Production Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Configure environment
vim .env  # Set production values

# Run with systemd (recommended)
sudo systemctl start ai-analyzer.service
sudo systemctl enable ai-analyzer.service
```

### Systemd Service

```ini
[Unit]
Description=AI Product Image Analyzer - Flask Server
After=network.target

[Service]
User=root
WorkingDirectory=/home/root/webapp
ExecStart=/usr/bin/python3 /home/root/webapp/app.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### Nginx Reverse Proxy (Optional)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 📖 Supported Product Types

| Category | Examples | Prompt Strategy |
|----------|----------|-----------------|
| **Clothing** | Shirts, dresses, jackets | Full body modeling shot |
| **Footwear** | Shoes, sneakers, boots | Full body with focus |
| **Accessories** | Bags, watches, jewelry | Close-up or lifestyle |
| **Electronics** | Phones, laptops, cameras | Hands-on demonstration |
| **Cosmetics** | Makeup, skincare | Beauty application |
| **Home Goods** | Furniture, decor | Lifestyle scene |
| **Sports** | Fitness equipment | Action/fitness modeling |

---

## 🔒 Security

- **Environment Variables**: API keys stored securely in `.env`
- **Input Validation**: File type, size, and format checking
- **CORS**: Configured for specific origins
- **No Data Storage**: Images processed in-memory only
- **Rate Limiting**: Optional rate limiting middleware

---

## 🐛 Troubleshooting

### Hugging Face API Errors

**Problem**: "Model is loading" error
```
Solution: Wait 30-60 seconds and retry. Free-tier models cold-start.
```

**Problem**: "API token not configured"
```
Solution: Set HUGGINGFACE_API_TOKEN in .env file
```

### Image Upload Issues

**Problem**: "File too large"
```
Solution: Compress image or ensure it's under 10MB
```

**Problem**: "Invalid file type"
```
Solution: Use JPG, PNG, or WebP format only
```

### Service Not Starting

```bash
# Check service status
sudo systemctl status ai-analyzer.service

# View logs
sudo journalctl -u ai-analyzer.service -n 50

# Restart service
sudo systemctl restart ai-analyzer.service
```

---

## 📊 Performance

- **Prompt Generation**: 5-15 seconds (depends on HF API)
- **Image Processing**: < 1 second
- **Memory Usage**: ~50MB base + ~200MB per request
- **Concurrent Requests**: Handles 10+ simultaneous users

---

## 🤝 Contributing

Contributions welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 Changelog

### v6.0.0 (2025-12-17) - Major Refactor
- ✨ NEW: AI Product Image Prompt Generator
- 🔥 REMOVED: Selenium automation (deprecated)
- 🏗️ REFACTOR: Modular backend architecture
- 🎨 NEW: Modern unified frontend
- 📚 IMPROVED: Documentation and examples
- 🐛 FIX: Multiple bug fixes and improvements

### v5.2.1 (Previous)
- Selenium Live View feature
- Persistent authentication
- Multi-version support (deprecated)

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**AI Product Analyzer Development Team**

- GitHub: [@bighi9999](https://github.com/bighi9999)
- Repository: [Quet](https://github.com/bighi9999/Quet)

---

## 🙏 Acknowledgments

- **Hugging Face**: Vision-language AI models
- **Google**: Gemini API
- **xAI**: Grok Vision API
- **OpenAI**: GPT-4 Vision API
- **Community**: Open-source contributors

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/bighi9999/Quet/issues)
- **Discussions**: [GitHub Discussions](https://github.com/bighi9999/Quet/discussions)
- **Live Demo**: [http://14.225.210.195:5000](http://14.225.210.195:5000)

---

**Made with ❤️ and AI**
