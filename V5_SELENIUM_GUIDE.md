# 🤖 AI Product Analyzer V5 - Selenium Edition

## 🚀 Deploy Successfully!

**URL**: http://14.225.210.195:5000/v5.html

**Latest Commit**: [Check GitHub](https://github.com/bighi9999/Quet)

---

## 🎯 Tính Năng V5

### ⚡ Dual Mode Operation

#### 1. **Selenium Web Automation Mode** (MIỄN PHÍ 100%)
- 🤖 Tự động truy cập trang web AI và scrape kết quả
- ✅ Không cần API key
- ✅ Không giới hạn sử dụng
- 🆓 Hoàn toàn miễn phí

**Supported Providers**:
- BLIP Image Captioning (Salesforce - Hugging Face)
- CLIP Interrogator (Hugging Face)
- Auto fallback: thử nhiều providers

**API Endpoint**:
```bash
POST /api/selenium-analyze
Content-Type: application/json

{
  "image": "data:image/png;base64,...",
  "provider": "auto", // auto | blip | clip
  "query": "Phân tích chi tiết hình ảnh sản phẩm này"
}
```

#### 2. **API Mode** (CÓ PHÍ)
- 🔑 Sử dụng API chính thức
- ✅ Gemini API (Server Key - Miễn phí)
- ✅ Grok API (Server Key - Miễn phí)
- 💰 OpenAI GPT-4 (Client Key - Có phí)

---

## 📋 API Endpoints

### Selenium Automation

#### 1. Single Provider Analysis
```bash
POST /api/selenium-analyze
```

**Request**:
```json
{
  "image": "base64_image_data",
  "provider": "auto",
  "query": "Phân tích sản phẩm"
}
```

**Response**:
```json
{
  "analysis": "Kết quả phân tích...",
  "provider": "blip-huggingface",
  "method": "selenium-web-automation",
  "model": "Salesforce/BLIP"
}
```

#### 2. Multi-Provider Analysis
```bash
POST /api/selenium-multi
```

**Request**:
```json
{
  "image": "base64_image_data",
  "providers": ["blip", "clip"],
  "query": "Phân tích sản phẩm"
}
```

#### 3. Cleanup Drivers
```bash
POST /api/selenium/cleanup
```

Release Selenium resources.

---

## 🛠️ Technical Stack

### Backend
- **Framework**: Flask (Python)
- **Automation**: Selenium + ChromeDriver
- **AI APIs**: Google Gemini, xAI Grok, OpenAI

### Frontend
- **HTML5 + CSS3**: Modern gradient UI
- **Vanilla JavaScript**: No framework dependencies
- **Particles.js**: Interactive background

### Infrastructure
- **Server**: Ubuntu 22.04 LTS
- **Web Server**: Flask development server
- **Process Manager**: systemd service
- **Port**: 5000 (public)
- **IP**: 14.225.210.195

---

## ⚠️ Selenium Limitations

### Authentication Required
Một số trang web AI yêu cầu đăng nhập:
- ❌ **Gemini AI Studio**: Cần Google account
- ❌ **ChatGPT**: Cần OpenAI account
- ❌ **Grok (X.AI)**: Cần X (Twitter) account

### Free Tools (No Auth Required)
- ✅ **BLIP** (Hugging Face): Image captioning
- ✅ **CLIP** (Hugging Face): Image analysis
- ⚠️ **Stability**: Free tools có thể không ổn định

### Recommended Approach
**Để có kết quả tốt nhất**:
1. **Selenium Mode**: Dùng cho test/demo miễn phí
2. **API Mode**: Dùng cho production với API keys chính thức

---

## 🔧 Configuration

### Server Environment Variables
```bash
# /home/root/webapp/.env
FLASK_APP=app.py
FLASK_ENV=production
HOST=0.0.0.0
PORT=5000
DEBUG=False

# API Keys (configured on server - không commit keys vào Git!)
GEMINI_API_KEY=your_gemini_api_key_here
GROK_API_KEY=your_grok_api_key_here
```

**⚠️ Security Warning**: Never commit real API keys to Git!

### systemd Service
```bash
# Status
sudo systemctl status ai-analyzer

# Restart
sudo systemctl restart ai-analyzer

# Logs
sudo journalctl -u ai-analyzer -f
```

---

## 📊 Usage Comparison

| Feature | Selenium Mode | API Mode |
|---------|--------------|----------|
| **Cost** | 🆓 FREE | 💰 Có phí (GPT-4) |
| **Auth** | ❌ Không cần | ✅ Cần API key |
| **Speed** | 🐢 Chậm (30-60s) | ⚡ Nhanh (3-10s) |
| **Accuracy** | ⭐⭐⭐ Trung bình | ⭐⭐⭐⭐⭐ Cao |
| **Stability** | ⚠️ Phụ thuộc web | ✅ Ổn định |
| **Best For** | Test, Demo | Production |

---

## 🎨 UI Features

### V5 Enhancements
- ⚡ **Dual Mode Selector**: Switch giữa Selenium và API
- 🎨 **Modern Gradient UI**: Dark Pro 2025 design
- 📸 **Drag & Drop**: Upload ảnh dễ dàng
- 📊 **Live Results**: Real-time analysis display
- 📜 **History**: Lưu 10 phân tích gần nhất
- 🔔 **Toast Notifications**: Thông báo trực quan
- ✨ **Particles Background**: Interactive animation

---

## 🌐 Access URLs

| Version | URL | Features |
|---------|-----|----------|
| **V5** | http://14.225.210.195:5000/v5.html | Selenium + API Mode |
| **V4** | http://14.225.210.195:5000/v4.html | API only (Gemini + Grok + OpenAI) |
| **V3** | http://14.225.210.195:5000/v3.html | Multi-AI Edition |
| **Homepage** | http://14.225.210.195:5000/ | Auto redirect to V5 |

---

## 🔐 Security Notes

### Current Setup (Development)
- ⚠️ No HTTPS (HTTP only)
- ⚠️ No authentication
- ⚠️ Public IP exposed

### Recommended for Production
1. **SSL/TLS**: Use Let's Encrypt + Nginx
2. **Authentication**: Add JWT or OAuth
3. **Rate Limiting**: Prevent abuse
4. **Firewall**: Restrict IP access
5. **Environment Variables**: Never commit API keys

---

## 📝 Testing

### Test Selenium Endpoint
```bash
curl -X POST http://14.225.210.195:5000/api/selenium-analyze \
  -H "Content-Type: application/json" \
  -d '{
    "image": "data:image/png;base64,iVBORw0KG...",
    "provider": "auto",
    "query": "Analyze this product image"
  }'
```

### Test API Endpoint
```bash
curl -X POST http://14.225.210.195:5000/api/gemini-analyze \
  -H "Content-Type: application/json" \
  -d '{
    "image": "data:image/png;base64,iVBORw0KG...",
    "useServerKey": true
  }'
```

### Check Server Status
```bash
curl http://14.225.210.195:5000/health
curl http://14.225.210.195:5000/api/config
```

---

## 🐛 Known Issues

### Selenium Mode
1. **Free Tools Unstable**: BLIP/CLIP có thể timeout hoặc fail
2. **Slow Performance**: Web scraping mất 30-60s
3. **Rate Limits**: Hugging Face Spaces có giới hạn requests

### Solutions
- ✅ Sử dụng API Mode cho production
- ✅ Implement retry logic
- ✅ Add request queue

### API Mode
1. **API Key Required**: OpenAI cần client key
2. **Cost**: GPT-4 Vision có phí (~$0.03/analysis)

---

## 📈 Future Improvements

### V6 Roadmap
- [ ] Add more free AI tools (Replicate, etc.)
- [ ] Implement API key rotation
- [ ] Add caching layer
- [ ] WebSocket for real-time updates
- [ ] Mobile app version
- [ ] Batch processing
- [ ] Cost tracking dashboard

---

## 🤝 Contributing

Repository: https://github.com/bighi9999/Quet

---

## 📞 Support

Nếu gặp vấn đề:
1. Check server status: `sudo systemctl status ai-analyzer`
2. View logs: `sudo journalctl -u ai-analyzer -f`
3. Restart service: `sudo systemctl restart ai-analyzer`

---

**✅ V5 Selenium Edition - READY FOR USE!**

Last Updated: 2025-12-17
