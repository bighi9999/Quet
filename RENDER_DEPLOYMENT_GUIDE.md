# 🚀 HƯỚNG DẪN DEPLOY LÊN RENDER.COM

## 📋 Tóm tắt nhanh
Code đã sẵn sàng và được commit vào Git. Do giới hạn sandbox, bạn cần deploy qua Render.com web interface hoặc từ máy local.

---

## ✅ OPTION 1: Deploy qua Render.com Web Interface (RECOMMENDED - Dễ nhất)

### **Bước 1: Chuẩn bị GitHub Repository**

#### **Cách A: Nếu chưa có code trên GitHub**

1. **Truy cập GitHub:**
   - Vào: https://github.com/bighi9999/bilunmarketing
   - Đăng nhập với account `bighi9999`

2. **Download code từ sandbox:**
   ```bash
   # Trên máy local của bạn, clone repo hiện tại:
   git clone https://github.com/bighi9999/bilunmarketing.git
   cd bilunmarketing
   ```

3. **Copy files từ sandbox:**
   - Bạn cần download tất cả files từ `/home/root/webapp/`
   - Upload lên GitHub repo
   
   **Files quan trọng cần có:**
   ```
   ├── index.js              (Main server - REQUIRED)
   ├── package.json          (Dependencies - REQUIRED)
   ├── package-lock.json     (Lock file)
   ├── render.yaml           (Render config - REQUIRED)
   ├── public/
   │   ├── v2.html          (V2 Pro UI)
   │   ├── index.html       (V1 Classic)
   │   └── access.html      (Access Portal)
   └── All documentation files (.md)
   ```

4. **Push lên GitHub:**
   ```bash
   git add .
   git commit -m "Add V2 Pro Edition - Ready for Render deployment"
   git push origin master
   ```

#### **Cách B: Nếu đã có code trên GitHub**
- Code đã được commit sẵn trong sandbox
- Chỉ cần pull về và push lên (nếu có quyền)

---

### **Bước 2: Deploy trên Render.com**

1. **Tạo Account Render.com:**
   - Truy cập: https://render.com
   - Click **"Get Started"** hoặc **"Sign Up"**
   - Chọn **"Sign Up with GitHub"** (khuyến nghị)
   - Authorize Render để access GitHub repos

2. **Tạo New Web Service:**
   - Sau khi đăng nhập, click **"New +"** (góc trên bên phải)
   - Chọn **"Web Service"**

3. **Connect Repository:**
   - Tìm và chọn repo: **"bilunmarketing"**
   - Click **"Connect"**

4. **Configure Service:**
   ```
   Name:              ai-product-analyzer
   Region:            Singapore (hoặc gần bạn nhất)
   Branch:            master
   Root Directory:    (để trống)
   Runtime:           Node
   Build Command:     npm install
   Start Command:     npm start
   Instance Type:     Free
   ```

5. **Advanced Settings (Optional nhưng recommended):**
   - Scroll xuống **"Environment Variables"**
   - Click **"Add Environment Variable"**
   - Thêm:
     ```
     Key:   NODE_VERSION
     Value: 18.20.8
     
     Key:   NODE_ENV
     Value: production
     ```

6. **Health Check (Important):**
   - Scroll đến **"Health Check Path"**
   - Nhập: `/api/health`
   - Điều này giúp Render monitor server status

7. **Deploy:**
   - Click **"Create Web Service"** (nút xanh ở cuối)
   - Đợi 3-5 phút để Render build và deploy
   - Theo dõi logs real-time trong dashboard

---

### **Bước 3: Lấy Public URL**

1. **Sau khi deploy thành công:**
   - Render sẽ hiển thị URL dạng: 
     ```
     https://ai-product-analyzer.onrender.com
     ```
   - Hoặc: `https://ai-product-analyzer-xxxx.onrender.com`

2. **Test URL:**
   - Mở: `https://your-app.onrender.com/api/health`
   - Phải thấy response:
     ```json
     {
       "status": "ok",
       "timestamp": "...",
       "message": "AI Product Image Analyzer is running!"
     }
     ```

3. **Access V2 Pro:**
   - URL chính: `https://your-app.onrender.com/v2`
   - V1 Classic: `https://your-app.onrender.com/v1`
   - Access Portal: `https://your-app.onrender.com/access`

---

## ✅ OPTION 2: Deploy từ Local Machine (Nếu có code local)

### **Bước 1: Cài đặt Render CLI (Optional)**

```bash
npm install -g @render.com/cli
```

### **Bước 2: Login Render CLI**

```bash
render login
```

### **Bước 3: Deploy**

```bash
cd /path/to/webapp
render deploy
```

---

## ✅ OPTION 3: Deploy với render.yaml (Blueprint)

Code đã có file `render.yaml` sẵn. Khi push lên GitHub và connect với Render:

1. Render sẽ tự động detect `render.yaml`
2. Click **"Apply Blueprint"**
3. Render tự động config theo file yaml
4. Deploy ngay!

File `render.yaml` hiện tại:
```yaml
services:
  - type: web
    name: ai-product-analyzer
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
    healthCheckPath: /api/health
    envVars:
      - key: NODE_VERSION
        value: 18.20.8
```

---

## 📊 Sau khi Deploy

### **1. Verify Deployment:**
```bash
# Health check
curl https://your-app.onrender.com/api/health

# V2 Pro
curl -I https://your-app.onrender.com/v2

# V1 Classic
curl -I https://your-app.onrender.com/v1
```

### **2. Monitor Logs:**
- Vào Render Dashboard
- Click vào service "ai-product-analyzer"
- Tab **"Logs"** để xem real-time logs
- Tab **"Metrics"** để xem CPU/Memory usage

### **3. Update Code:**
Khi bạn update code:
```bash
git add .
git commit -m "Update features"
git push origin master
```
→ Render sẽ **auto-deploy** trong vài phút!

---

## 🔧 Troubleshooting

### **❌ Build Failed:**
**Lỗi**: `npm install` failed
**Fix**: 
1. Check `package.json` có đầy đủ dependencies không
2. Verify Node version (18.20.8)
3. Check logs để xem error chi tiết

### **❌ Service Not Starting:**
**Lỗi**: Service crash ngay sau start
**Fix**:
1. Check start command: `npm start` → chạy `node index.js`
2. Verify port: Render tự assign port qua `process.env.PORT`
3. Code phải listen: `app.listen(process.env.PORT || 3000)`

### **❌ 404 Not Found:**
**Lỗi**: Truy cập URL nhưng 404
**Fix**:
1. Verify static files: `public/` folder có đầy đủ không
2. Check Express static middleware: `app.use(express.static('public'))`
3. Check routes: `/v2`, `/v1`, `/access` có được config không

### **❌ API Calls Failed:**
**Lỗi**: OpenAI API không hoạt động
**Fix**:
1. User cần nhập API key trên UI (không config trên server)
2. Check CORS nếu frontend ở domain khác
3. Verify network access (Render free tier có limits)

### **❌ Free Tier Limitations:**
**Vấn đề**: Service sleep sau 15 phút không activity
**Solution**:
- Free tier của Render sẽ spin down sau 15 phút idle
- Wake up khi có request mới (có thể mất 30-60s)
- Upgrade lên paid plan ($7/month) để có 24/7 uptime

---

## 💰 Pricing

### **Render.com Free Tier:**
- ✅ Miễn phí vĩnh viễn
- ✅ 750 giờ/tháng (đủ cho 1 service 24/7)
- ✅ HTTPS tự động
- ✅ Auto-deploy từ GitHub
- ⚠️ Service sleep sau 15 phút idle
- ⚠️ 512MB RAM
- ⚠️ Shared CPU

### **Paid Plans:**
- **Starter**: $7/month
  - 24/7 uptime (không sleep)
  - 512MB RAM
  - Faster CPU
  
- **Standard**: $25/month
  - 2GB RAM
  - Dedicated CPU
  - Better performance

### **OpenAI API Costs:**
- ~$0.05 per workflow (không đổi)
- User tự trả (qua API key của họ)

---

## 🎯 Expected Results

### **Production URL:**
```
https://ai-product-analyzer.onrender.com
```

### **Features Live:**
- ✅ V2 Pro: /v2 (16 features)
- ✅ V1 Classic: /v1 (8 features)
- ✅ Access Portal: /access
- ✅ Health Check: /api/health
- ✅ API Endpoints: /api/analyze, /api/generate

### **Performance:**
- First request (cold start): 30-60s (free tier)
- Subsequent requests: < 1s
- AI processing: 10-15s (analysis) + 15-30s (generation)

---

## 📚 Tài liệu thêm

- **Render.com Docs**: https://render.com/docs
- **Deploy Node.js**: https://render.com/docs/deploy-node-express-app
- **Render CLI**: https://render.com/docs/cli
- **GitHub Integration**: https://render.com/docs/github

---

## ✅ Checklist Deploy

Trước khi deploy, verify:

- [ ] Code đã commit vào Git
- [ ] File `render.yaml` có sẵn
- [ ] `package.json` có đầy đủ dependencies
- [ ] `index.js` listen trên `process.env.PORT || 3000`
- [ ] Static files trong folder `public/`
- [ ] Health check endpoint `/api/health` hoạt động
- [ ] Code đã push lên GitHub (nếu dùng web interface)

Sau khi deploy:

- [ ] Health check trả về 200 OK
- [ ] V2 Pro accessible: `/v2`
- [ ] V1 Classic accessible: `/v1`
- [ ] Access Portal accessible: `/access`
- [ ] API endpoints hoạt động: `/api/analyze`, `/api/generate`
- [ ] Test với OpenAI API key thật
- [ ] Upload ảnh và phân tích
- [ ] Generate images thành công
- [ ] All V2 features working (dark mode, history, etc.)

---

## 🎉 Success!

Nếu tất cả hoạt động:

### **Your Production URLs:**
```
🌐 V2 Pro:     https://ai-product-analyzer.onrender.com/v2
📸 V1 Classic: https://ai-product-analyzer.onrender.com/v1
🏠 Portal:     https://ai-product-analyzer.onrender.com/access
🏥 Health:     https://ai-product-analyzer.onrender.com/api/health
```

### **Share với users:**
```
Webapp của bạn: https://ai-product-analyzer.onrender.com/v2
Hướng dẫn: Nhập OpenAI API key và upload ảnh!
Chi phí: ~$0.05 per workflow
```

---

## 🆘 Cần Help?

1. **Check Render Logs:**
   - Dashboard → Service → Logs tab
   
2. **Check Status:**
   - Dashboard → Service → Settings
   
3. **Re-deploy:**
   - Dashboard → Service → Manual Deploy → Deploy latest commit

4. **Contact:**
   - Render Support: https://render.com/support
   - Render Community: https://community.render.com

---

## 📝 Summary

**Status**: Code sẵn sàng deploy! ✅

**Next Steps:**
1. Push code lên GitHub (nếu chưa)
2. Connect Render.com với GitHub
3. Create Web Service từ repo
4. Deploy!
5. Get public URL
6. Share & enjoy! 🎉

**Estimated Time**: 10-15 phút

**Cost**: FREE (Render free tier)

---

Made with ❤️ and AI

**Date**: 2025-12-17  
**Version**: 2.0.0 Pro  
**Status**: Ready for Production ✅
