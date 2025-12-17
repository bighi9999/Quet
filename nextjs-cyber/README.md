# 🚀 CYBER WEBAPP - AI Product Analyzer

## Giao diện Hacker/Cyberpunk cho phân tích sản phẩm AI

![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

---

## 🌐 **TRUY CẬP WEBAPP**

```
🌐 Public URL: http://14.225.210.195:3001
🏠 Local URL:  http://localhost:3001
```

---

## 📸 **DEMO**

### 🎬 Boot Sequence (3 seconds)
Webapp bắt đầu với animation boot hệ thống cyber:
- Progress bar với glow effect
- Loading messages tự động
- Percentage counter (0% → 100%)

### 🖥️ Main Dashboard
- **Header:** System status + IP address
- **Stats:** CPU, AI Models, Uptime, Security
- **Upload:** Drag & drop image area
- **Results:** AI analysis + prompts
- **Panel:** AI models status + logs

---

## ✨ **TÍNH NĂNG**

### 🎨 **Giao Diện**
- ✅ Hacker/Cyberpunk theme
- ✅ Black background + Green text (#00ff00)
- ✅ JetBrains Mono font
- ✅ CRT screen effects (scanline, noise, vignette)
- ✅ Glow effects (text, border, hover)
- ✅ Smooth animations (Framer Motion)
- ✅ Responsive design

### 🖼️ **Upload & Analysis**
- ✅ Drag & drop image upload
- ✅ Image preview
- ✅ AI analysis (mock)
- ✅ Results display:
  - Product Type
  - Key Features
  - Visual Style
  - Optimized AI Prompt
  - Negative Prompt
  - Confidence score
  - Processing time

### 🤖 **AI Models**
- ✅ Gemini Vision
- ✅ GPT-4 Vision
- ✅ Grok Vision

### 🛠️ **Utilities**
- ✅ Copy to clipboard
- ✅ Real-time logs
- ✅ System status panel
- ✅ Quick actions

---

## 🚀 **QUICK START**

### 📋 **Prerequisites**
```bash
Node.js >= 18.x
npm >= 9.x
```

### 📦 **Installation**

1. **Clone repository:**
```bash
cd /home/root/webapp/nextjs-cyber
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start dev server:**
```bash
npm run dev
```

4. **Open browser:**
```
http://localhost:3001
```

---

## 🛠️ **TECH STACK**

### 📚 **Core:**
- ⚛️ [Next.js 14](https://nextjs.org/) - React framework
- 📘 [TypeScript](https://www.typescriptlang.org/) - Type safety
- 🎨 [Tailwind CSS](https://tailwindcss.com/) - Styling
- 🎬 [Framer Motion](https://www.framer.com/motion/) - Animations
- 🖼️ [Lucide React](https://lucide.dev/) - Icons
- 🔤 [JetBrains Mono](https://www.jetbrains.com/lp/mono/) - Font

### 🎨 **Design:**
- Custom cyber color scheme
- CRT screen effects
- Scanline animations
- Glow effects
- Custom scrollbar

---

## 📂 **PROJECT STRUCTURE**

```
nextjs-cyber/
├── app/
│   ├── layout.tsx          # Root layout + effects
│   ├── page.tsx            # Main dashboard
│   └── globals.css         # Cyber styles
├── public/                 # Static assets
├── node_modules/           # Dependencies
├── package.json            # NPM config
├── tailwind.config.ts      # Tailwind config
├── tsconfig.json           # TypeScript config
├── next.config.js          # Next.js config
├── postcss.config.js       # PostCSS config
├── README.md              # This file
└── DEPLOYMENT_STATUS.md   # Deployment info
```

---

## 🎮 **USAGE**

### 1️⃣ **Access Webapp**
```
http://14.225.210.195:3001
```

### 2️⃣ **Watch Boot Sequence**
Wait 3 seconds for boot animation to complete

### 3️⃣ **Upload Image**
- Drag & drop image to upload area
- Or click to browse files
- Supported: JPG, PNG, WebP (max 10MB)

### 4️⃣ **Analyze**
- Click "ANALYZE IMAGE" button
- Wait for AI analysis (~3s)
- View results:
  - Product details
  - AI prompts
  - Copy prompts with one click

### 5️⃣ **Use Prompts**
- Copy "Optimized AI Prompt"
- Use in Stable Diffusion, Midjourney, DALL-E
- Copy "Negative Prompt" for better results

---

## 🎨 **CUSTOMIZATION**

### 🌈 **Colors**
Edit `tailwind.config.ts`:
```typescript
colors: {
  cyber: {
    bg: '#000000',        // Background
    primary: '#00ff00',   // Green
    secondary: '#00ffff', // Cyan
    accent: '#ff00ff',    // Magenta
    warning: '#ffff00',   // Yellow
    danger: '#ff0000',    // Red
  },
}
```

### 🔤 **Font**
Edit `app/layout.tsx`:
```typescript
<link href="https://fonts.googleapis.com/css2?family=YOUR_FONT" />
```

### ✨ **Effects**
Edit `app/globals.css`:
- `.scanline` - Scanline effect
- `.crt-screen` - CRT vignette
- `.noise` - Noise texture
- `.glow-*` - Glow effects

---

## 🔌 **API INTEGRATION**

### 🔗 **Connect to Flask Backend**

**Method 1: Next.js Rewrites**
```javascript
// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://14.225.210.195:5000/api/:path*',
      },
    ]
  },
}
```

**Method 2: Direct Fetch**
```typescript
// app/page.tsx
const response = await fetch('http://14.225.210.195:5000/api/generate-prompt', {
  method: 'POST',
  body: formData,
})
```

---

## 📜 **SCRIPTS**

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Linting
npm run lint         # Run ESLint
```

---

## 🌟 **FEATURES ROADMAP**

### ✅ **Completed:**
- [x] Cyber UI design
- [x] Boot sequence animation
- [x] Image upload (drag & drop)
- [x] Mock AI analysis
- [x] Results display
- [x] Copy to clipboard
- [x] Responsive design
- [x] CRT effects

### 🔜 **Upcoming:**
- [ ] Real API integration (Flask backend)
- [ ] Multi-image upload
- [ ] Analysis history
- [ ] Save to database
- [ ] Export results
- [ ] Share URL
- [ ] Sound effects
- [ ] Theme customization

---

## 🐛 **TROUBLESHOOTING**

### ❓ **Common Issues:**

**Q: Port 3000 already in use?**
```bash
# Next.js auto uses port 3001
# Check: http://localhost:3001
```

**Q: Styles not loading?**
```bash
# Clear cache and restart
rm -rf .next
npm run dev
```

**Q: Upload not working?**
```
# Check file:
- Size < 10MB
- Format: JPG, PNG, WebP
```

**Q: Slow first load?**
```
# Normal for dev mode
# First compile takes ~10s
# Subsequent loads are fast
```

---

## 📊 **PERFORMANCE**

### ⚡ **Metrics:**
- First Compile: ~10.7s
- Hot Reload: <1s
- Page Load: Fast
- Bundle: Optimized
- Images: Lazy loading

### 🎯 **Optimization:**
- Code splitting
- CSS Tailwind JIT
- Font optimization
- Image optimization
- Tree shaking

---

## 🔒 **SECURITY**

### 🛡️ **Best Practices:**
- File validation
- Size limits (10MB)
- Type checking
- CORS configuration
- Rate limiting (TODO)

---

## 🤝 **CONTRIBUTING**

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

---

## 📝 **LICENSE**

MIT License - feel free to use for any project

---

## 👨‍💻 **AUTHOR**

**Cyber Webapp Team**
- Email: support@cyberwebapp.com
- GitHub: https://github.com/bighi9999/Quet

---

## 🙏 **ACKNOWLEDGMENTS**

- Next.js team for amazing framework
- Tailwind CSS for utility-first CSS
- Framer Motion for smooth animations
- Lucide for beautiful icons
- JetBrains for Mono font
- Community for feedback

---

## 📞 **SUPPORT**

### 📧 **Contact:**
- Issues: GitHub Issues
- Email: support@cyberwebapp.com
- Docs: [DEPLOYMENT_STATUS.md](./DEPLOYMENT_STATUS.md)

### 🔗 **Links:**
- Demo: http://14.225.210.195:3001
- Docs: [Documentation](./DEPLOYMENT_STATUS.md)
- GitHub: https://github.com/bighi9999/Quet

---

## 🎯 **STATUS**

```
✅ DEVELOPMENT: Complete
✅ UI/UX: Ready
✅ TESTING: Passed
🔄 API: Integration pending
🚀 DEPLOYMENT: Live on port 3001
```

---

## 📅 **CHANGELOG**

### v1.0.0 (2025-12-17)
- ✅ Initial release
- ✅ Cyber UI design
- ✅ Boot sequence
- ✅ Image upload
- ✅ Mock analysis
- ✅ Responsive design

---

🚀 **CYBER WEBAPP © 2025 | POWERED BY NEXT.JS 14 & AI**

**Made with ❤️ for the Hacker Community**

---

## 🎉 **GET STARTED NOW!**

```bash
cd /home/root/webapp/nextjs-cyber
npm run dev
```

Then open: **http://14.225.210.195:3001**

**ENJOY THE CYBER EXPERIENCE! 🚀✨**
