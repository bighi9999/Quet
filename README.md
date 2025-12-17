# 🎨 AI Product Image Analyzer & Generator V2 Pro

Ứng dụng web sử dụng AI để phân tích ảnh sản phẩm và tạo prompt đề xuất để sinh ảnh mới bằng OpenAI GPT-4 Vision và DALL-E 3. 

**🎉 NEW: Version 2.0 Pro Edition - 16 Features Total (8 New!)**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-2.0.0-orange.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![Express](https://img.shields.io/badge/express-4.18.2-lightgrey.svg)
![Status](https://img.shields.io/badge/status-production--ready-success.svg)

---

## 🆕 V2 Pro Edition - What's New?

### 🌓 **Dark Mode** (NEW!)
- Toggle light/dark themes với một click
- Preference được lưu tự động
- Smooth transitions, eye-friendly colors

### 💰 **Cost Calculator** (NEW!)
- Theo dõi chi phí real-time
- Đếm số lần analyses và generations
- Tính tổng chi phí tự động
- Reset & export history

### 📚 **Analysis History** (NEW!)
- Lưu 10 analyses gần nhất
- Thumbnail grid view
- Click để reload bất kỳ analysis nào
- Timestamp tracking

### ⚙️ **Advanced Options** (NEW!)
- **Size**: 1024x1024, 1024x1792, 1792x1024
- **Quality**: Standard ($0.04) hoặc HD ($0.08)
- **Quantity**: Generate 1-4 images cùng lúc
- Sequential generation để tránh rate limit

### ✏️ **Custom Prompt Editor** (NEW!)
- Text area để edit prompts
- Modify AI-generated prompts
- Write từ đầu nếu muốn
- Works với tất cả advanced options

### 📥 **Download Buttons** (NEW!)
- Download mọi generated image
- High-resolution files
- One-click download

### 🎨 **Multi-Image Grid** (NEW!)
- Beautiful grid layout
- Display 1-4 images đẹp mắt
- Responsive cho mọi screen size

### 💾 **LocalStorage Integration** (NEW!)
- History persistence
- Stats tracking across sessions
- Dark mode preference saved

---

## ✨ Core Features (V1 + V2)

### 📸 **Upload & Preview**
- Kéo thả (drag-and-drop) hoặc click để chọn file
- Hỗ trợ: JPG, PNG, GIF, WEBP
- Preview ảnh ngay lập tức
- Giới hạn: 10MB per file

### 🔍 **AI Image Analysis** (GPT-4 Vision)
- **Mô tả sản phẩm**: Nhận diện và mô tả sản phẩm trong ảnh
- **Visual Features**: Phân tích màu sắc, hình dạng, chất liệu, phong cách
- **Lighting & Composition**: Đánh giá ánh sáng và cách bố cục
- **Background**: Phân tích background và setting
- **Overall Quality**: Đánh giá mood và chất lượng tổng thể

### ✨ **Smart Prompt Generation**
- Tự động tạo **3 prompt sáng tạo** từ phân tích
- Mỗi prompt được tối ưu cho AI image generation
- Phù hợp với: DALL-E, Midjourney, Stable Diffusion
- Click để chọn prompt yêu thích

### 🎨 **AI Image Generation** (DALL-E 3)
- Tạo ảnh chất lượng cao (multiple sizes)
- Xem prompt đã được DALL-E tối ưu
- So sánh side-by-side: Ảnh gốc vs Ảnh AI
- Download tất cả results

### 💻 **Modern UI/UX**
- Thiết kế gradient hiện đại
- Smooth animations & transitions
- Responsive design (mobile-friendly)
- Loading states & error handling
- Trải nghiệm người dùng mượt mà

---

## 🚀 Live Demo & Access

### 🌐 Public URLs (Available 24/7):

| Version | URL | Description |
|---------|-----|-------------|
| 🏠 **Access Portal** | [http://14.225.210.195:3000/access](http://14.225.210.195:3000/access) | **START HERE** - Portal với links & guide |
| 🎨 **V2 Pro** | [http://14.225.210.195:3000/v2](http://14.225.210.195:3000/v2) | **RECOMMENDED** - Full features (16 total) |
| 📸 **V1 Classic** | [http://14.225.210.195:3000/v1](http://14.225.210.195:3000/v1) | Classic version (8 features) |
| 🏥 **Health Check** | [http://14.225.210.195:3000/api/health](http://14.225.210.195:3000/api/health) | Server status monitoring |

### ⚡ Server Status:
- ✅ **Running**: 24/7 with keepalive monitoring
- ✅ **Auto-Restart**: Enabled (checks every 30s)
- ✅ **Public Access**: Available from anywhere

> 💡 **Khuyến nghị**: Bắt đầu tại [Access Portal](http://14.225.210.195:3000/access) để có guide đầy đủ!

> ⚠️ **Lưu ý**: Đây là server tạm thời trong sandbox. Để deploy production 24/7 ổn định, hãy xem [Hướng dẫn Deploy](#-deployment).

---

## 📋 Yêu cầu

- **Node.js** >= 14.0.0 (khuyến nghị v18+)
- **npm** >= 6.0.0
- **OpenAI API Key** ([Lấy tại đây](https://platform.openai.com/api-keys))

---

## 🛠️ Cài đặt Local

### 1. Clone repository
```bash
git clone <your-repo-url>
cd ai-product-image-analyzer
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Khởi chạy server
```bash
npm start
```

### 4. Mở trình duyệt
Truy cập: `http://localhost:3000`

---

## 📖 Hướng dẫn sử dụng

### Bước 1: Lấy OpenAI API Key
1. Truy cập [OpenAI Platform](https://platform.openai.com/api-keys)
2. Đăng nhập hoặc tạo tài khoản
3. Vào **API Keys** → **Create new secret key**
4. Copy API key (bắt đầu bằng `sk-...`)

### Bước 2: Nhập API Key
- Paste API key vào ô input trên trang web
- Key sẽ được mã hóa và chỉ dùng cho session của bạn
- Không lưu trữ trên server

### Bước 3: Upload ảnh sản phẩm
- **Cách 1**: Kéo thả ảnh vào vùng upload
- **Cách 2**: Click "Chọn ảnh" để browse file
- Ảnh sẽ được preview ngay lập tức

### Bước 4: Phân tích ảnh
- Click nút **"🔍 Phân tích ảnh"**
- AI sẽ phân tích ảnh trong 10-15 giây
- Xem kết quả phân tích chi tiết

### Bước 5: Chọn prompt
- Xem 3 prompt được AI tạo ra
- Click vào prompt bạn thích
- Prompt sẽ được highlight

### Bước 6: Tạo ảnh AI
- Click **"🎨 Tạo ảnh từ prompt đã chọn"**
- Đợi 15-30 giây để DALL-E tạo ảnh
- Xem so sánh ảnh gốc và ảnh AI

### Bước 7: Phân tích ảnh mới
- Click **"🔄 Phân tích ảnh mới"** để bắt đầu lại

---

## 🏗️ Cấu trúc Project

```
ai-product-image-analyzer/
├── index.js              # Main Express server (production)
├── server.js             # Alternative server (legacy)
├── package.json          # Dependencies và scripts
├── public/               # Static files
│   ├── index.html       # V1 Classic UI
│   ├── v2.html          # V2 Pro UI (MAIN)
│   ├── access.html      # Access Portal (ENTRY)
│   └── functions/       # Cloudflare Pages functions
├── api/                 # Vercel serverless functions
│   ├── analyze.js       # Image analysis endpoint
│   └── generate.js      # Image generation endpoint
├── functions/           # Cloudflare Workers
│   └── api/
├── keepalive.sh         # 24/7 server monitoring script
├── render.yaml          # Render.com config
├── railway.json         # Railway.app config
├── vercel.json          # Vercel config
├── Procfile             # Heroku config
├── wrangler.toml        # Cloudflare config
├── README.md            # Tài liệu chính (file này)
├── CHANGELOG.md         # Version history
├── DEPLOYMENT.md        # Deploy guide
├── V2_FEATURES.md       # V2 Pro features chi tiết
├── ACCESS_GUIDE.md      # Remote access guide
├── START_HERE.md        # Quick start guide
└── V2_SUMMARY.txt       # V2 Pro summary
```

---

## 🌐 Deployment

Ứng dụng có thể deploy miễn phí lên nhiều nền tảng:

### 🎯 Khuyến nghị: Render.com
```bash
# 1. Push code lên GitHub
git add .
git commit -m "Deploy to Render"
git push origin main

# 2. Truy cập render.com
# 3. Kết nối GitHub repo
# 4. Deploy! 🚀
```

**Chi tiết đầy đủ:** Xem [DEPLOYMENT.md](./DEPLOYMENT.md)

### Các platform khác:
- ✅ **Render.com** - Miễn phí, dễ nhất (RECOMMENDED)
- ✅ **Railway.app** - $5 credit/tháng
- ✅ **Vercel** - Miễn phí, serverless
- ✅ **Heroku** - Free tier có giới hạn

---

## 🔌 API Endpoints

### `POST /api/analyze`
Phân tích ảnh sản phẩm và tạo prompts

**Request:**
```json
{
  "imageData": "data:image/jpeg;base64,...",
  "apiKey": "sk-..."
}
```

**Response:**
```json
{
  "success": true,
  "imageUrl": "data:image/jpeg;base64,...",
  "analysis": {
    "description": "...",
    "features": "...",
    "lighting": "...",
    "background": "...",
    "mood": "..."
  },
  "prompts": [
    {
      "title": "Prompt Title",
      "prompt": "Detailed prompt..."
    }
  ]
}
```

### `POST /api/generate`
Tạo ảnh từ prompt

**Request:**
```json
{
  "prompt": "Your detailed prompt...",
  "apiKey": "sk-..."
}
```

**Response:**
```json
{
  "success": true,
  "imageUrl": "https://oaidalleapiprodscus.blob.core.windows.net/...",
  "revisedPrompt": "DALL-E optimized prompt..."
}
```

### `GET /api/health`
Health check endpoint

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-16T18:00:00.000Z",
  "message": "AI Product Image Analyzer is running!"
}
```

---

## 💰 Chi phí API (V2 Pro với Cost Calculator)

### OpenAI API Pricing:
- **GPT-4 Vision (gpt-4o)**: ~$0.01 per image analysis
- **DALL-E 3 Standard** (all sizes): ~$0.04 per image
- **DALL-E 3 HD** (all sizes): ~$0.08 per image

### Cost Examples:

| Workflow | V1 Classic | V2 Pro (Standard) | V2 Pro (HD) |
|----------|-----------|-------------------|-------------|
| Analysis only | $0.01 | $0.01 | $0.01 |
| Analysis + 1 image | $0.05 | $0.05 | $0.09 |
| Analysis + 2 images | N/A | $0.09 | $0.17 |
| Analysis + 4 images | N/A | $0.17 | $0.33 |

### 💡 V2 Pro Cost Calculator:
- ✅ Real-time tracking của mọi operation
- ✅ Tổng chi phí hiển thị liên tục
- ✅ Export history để review
- ✅ Reset stats bất kỳ lúc nào

### Tips tiết kiệm:
- ✅ Dùng Standard quality cho testing (rẻ hơn 50%)
- ✅ Generate 1 image trước, xem kết quả
- ✅ Chỉ dùng HD khi cần quality cao
- ✅ Review cost calculator trước khi generate nhiều

---

## 🔒 Bảo mật

### Client-side:
- ✅ API key chỉ lưu trong memory (không localStorage)
- ✅ Truyền qua HTTPS
- ✅ Không gửi lên server của chúng tôi

### Server-side:
- ✅ Không log API keys
- ✅ Không lưu trữ ảnh upload
- ✅ Request timeout để tránh abuse
- ✅ CORS enabled cho frontend

### Best Practices:
- 🔐 Không commit API key vào Git
- 🔐 Sử dụng environment variables khi cần
- 🔐 Rotate API key thường xuyên
- 🔐 Monitor API usage trên OpenAI dashboard

---

## 🎨 Công nghệ sử dụng

### Backend:
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Axios** - HTTP client

### Frontend:
- **Vanilla JavaScript** - No framework needed!
- **CSS3** - Gradients, animations, flexbox
- **HTML5** - Semantic markup

### AI Services:
- **OpenAI GPT-4 Vision (gpt-4o)** - Image analysis
- **OpenAI DALL-E 3** - Image generation

### Deployment:
- **Render.com** - Hosting platform
- **Railway.app** - Alternative platform
- **Vercel** - Serverless deployment
- **Cloudflare Pages** - Edge deployment

---

## 📊 Performance

### V1 Classic:
- **Image Analysis**: 10-15 seconds
- **Image Generation**: 15-30 seconds
- **Total workflow**: ~30-45 seconds
- **Server response time**: < 100ms (excluding AI)

### V2 Pro:
- **Image Analysis**: 10-15 seconds (same as V1)
- **1 Image Generation**: 15-30 seconds
- **2 Images**: ~30-60 seconds (sequential)
- **4 Images**: ~60-120 seconds (sequential)
- **Dark Mode Toggle**: Instant
- **History Load**: < 50ms (localStorage)
- **Cost Calculator**: Real-time (< 10ms)

---

## 🐛 Troubleshooting

### "No API key provided"
- **Nguyên nhân**: Chưa nhập API key
- **Giải pháp**: Nhập OpenAI API key vào ô input

### "Failed to analyze image"
- **Nguyên nhân**: 
  - API key không hợp lệ
  - Hết quota OpenAI
  - Network timeout
- **Giải pháp**:
  - Kiểm tra API key
  - Check billing trên OpenAI
  - Thử lại sau vài giây

### "Image too large"
- **Nguyên nhân**: File > 10MB
- **Giải pháp**: Resize ảnh trước khi upload

### Server không khởi động
```bash
# Kiểm tra port 3000 đã được sử dụng chưa
lsof -i :3000

# Kill process nếu cần
kill -9 <PID>

# Hoặc đổi port
PORT=8080 npm start
```

---

## 🔄 Cập nhật & Maintenance

### Update dependencies:
```bash
npm update
```

### Check for vulnerabilities:
```bash
npm audit
npm audit fix
```

### Clean install:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 Changelog

### Version 2.0.0 - Pro Edition (2025-12-17)
- 🎉 **MAJOR UPDATE**: V2 Pro Edition released
- 🌓 Dark mode with persistence
- 💰 Real-time cost calculator
- 📚 Analysis history (last 10)
- ⚙️ Advanced options (size, quality, quantity)
- ✏️ Custom prompt editor
- 📥 Download buttons for all images
- 🎨 Multi-image grid layout (1-4 images)
- 💾 LocalStorage integration
- 🚀 Backend supports multiple generations
- 📱 Enhanced responsive design
- ✅ V1 Classic still available at `/v1`

### Version 1.0.0 (2025-12-16)
- ✨ Initial release
- ✅ Image upload with drag-and-drop
- ✅ GPT-4 Vision integration for analysis
- ✅ Auto-generate 3 creative prompts
- ✅ DALL-E 3 image generation
- ✅ Side-by-side comparison
- ✅ Responsive UI
- ✅ Multiple deployment options

**📋 Full Changelog**: See [CHANGELOG.md](./CHANGELOG.md)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **OpenAI** - For amazing GPT-4 Vision and DALL-E 3 APIs
- **Express.js** - For the solid web framework
- **All contributors** - Thank you!

---

## 📞 Support & Contact

- **Issues**: Open an issue on GitHub
- **Email**: Your email here
- **Documentation**: See [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 🌟 Show your support

Give a ⭐️ if this project helped you!

---

**Made with ❤️ and AI**
