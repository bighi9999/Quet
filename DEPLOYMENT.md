# 🚀 Hướng dẫn Deploy AI Product Image Analyzer

Ứng dụng này có thể được deploy miễn phí lên nhiều nền tảng khác nhau. Dưới đây là hướng dẫn chi tiết cho từng platform.

## 📋 Yêu cầu trước khi deploy

- Tài khoản GitHub (để push code)
- OpenAI API Key (người dùng sẽ tự nhập trên web interface)

---

## 🎯 Option 1: Deploy lên Render.com (RECOMMENDED - Miễn phí)

Render.com cung cấp hosting miễn phí cho web apps với:
- ✅ HTTPS miễn phí
- ✅ Tự động deploy từ GitHub
- ✅ Chạy 24/7
- ⚠️ Server có thể sleep sau 15 phút không hoạt động (sẽ wake up khi có request)

### Bước 1: Push code lên GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Bước 2: Đăng ký Render.com
1. Truy cập https://render.com
2. Đăng ký tài khoản (có thể dùng GitHub)

### Bước 3: Tạo Web Service
1. Click "New +" → "Web Service"
2. Kết nối GitHub repository của bạn
3. Cấu hình:
   - **Name**: `ai-product-analyzer` (hoặc tên bạn muốn)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
4. Click "Create Web Service"

### Bước 4: Đợi deploy hoàn tất
- Render sẽ tự động build và deploy
- Bạn sẽ nhận được URL dạng: `https://ai-product-analyzer.onrender.com`

---

## 🚂 Option 2: Deploy lên Railway.app (Miễn phí với giới hạn)

Railway cung cấp:
- ✅ $5 credit miễn phí mỗi tháng
- ✅ Deployment nhanh chóng
- ✅ Chạy 24/7

### Bước 1: Đăng ký Railway
1. Truy cập https://railway.app
2. Đăng nhập bằng GitHub

### Bước 2: Deploy từ GitHub
1. Click "New Project"
2. Chọn "Deploy from GitHub repo"
3. Chọn repository của bạn
4. Railway sẽ tự động detect và deploy

### Bước 3: Lấy URL
- Click vào deployment
- Vào "Settings" → "Domains"
- Click "Generate Domain"
- Bạn sẽ có URL dạng: `https://your-app.up.railway.app`

---

## ☁️ Option 3: Deploy lên Vercel (Serverless)

Vercel tốt cho static sites và serverless functions:
- ✅ Miễn phí hoàn toàn
- ✅ HTTPS tự động
- ✅ Edge network toàn cầu

### Bước 1: Cài đặt Vercel CLI
```bash
npm install -g vercel
```

### Bước 2: Deploy
```bash
vercel --prod
```

### Bước 3: Làm theo hướng dẫn CLI
- Login với GitHub/Email
- Chọn project settings
- Deploy hoàn tất, bạn sẽ nhận được URL

---

## 🐳 Option 4: Deploy lên Heroku

Heroku cung cấp free tier (có giới hạn):

### Bước 1: Cài đặt Heroku CLI
```bash
# Ubuntu/Debian
curl https://cli-assets.heroku.com/install.sh | sh

# macOS
brew tap heroku/brew && brew install heroku
```

### Bước 2: Login và tạo app
```bash
heroku login
heroku create ai-product-analyzer
```

### Bước 3: Deploy
```bash
git push heroku main
```

### Bước 4: Mở app
```bash
heroku open
```

---

## 🔧 Cấu hình sau khi deploy

### Environment Variables (nếu cần)
Hầu hết platforms cho phép set environment variables:
- `PORT`: Tự động set bởi platform
- Bạn KHÔNG cần set OpenAI API key vì người dùng sẽ nhập trên web interface

### Custom Domain (Optional)
Tất cả các platforms đều hỗ trợ custom domain:
1. Mua domain của bạn
2. Vào settings của platform
3. Thêm custom domain
4. Cập nhật DNS records

---

## 📊 So sánh các nền tảng

| Platform | Miễn phí | Chạy 24/7 | Sleep | Deploy Speed | Khuyến nghị |
|----------|----------|-----------|-------|--------------|-------------|
| **Render** | ✅ | ✅ | 15 phút | Trung bình | ⭐⭐⭐⭐⭐ |
| **Railway** | $5/tháng | ✅ | ❌ | Nhanh | ⭐⭐⭐⭐ |
| **Vercel** | ✅ | ✅ | ❌ | Rất nhanh | ⭐⭐⭐⭐ |
| **Heroku** | Limited | ✅ | 30 phút | Trung bình | ⭐⭐⭐ |

---

## 🎯 Khuyến nghị cho người mới

**Dùng Render.com** vì:
1. ✅ Hoàn toàn miễn phí
2. ✅ Dễ setup nhất
3. ✅ Tự động deploy từ GitHub
4. ✅ HTTPS miễn phí
5. ✅ Không cần credit card

### Quick Start với Render:
```bash
# 1. Push code lên GitHub
git init
git add .
git commit -m "Deploy AI Product Analyzer"
git remote add origin YOUR_REPO_URL
git push -u origin main

# 2. Truy cập render.com và kết nối repo
# 3. Đợi 2-3 phút
# 4. Xong! 🎉
```

---

## 🔒 Bảo mật

- ✅ API key của người dùng chỉ được gửi qua HTTPS
- ✅ Không lưu trữ API key trên server
- ✅ Mỗi người dùng tự nhập API key của họ
- ✅ Tất cả platforms đều cung cấp HTTPS miễn phí

---

## 🐛 Troubleshooting

### Server sleep trên Render
- **Vấn đề**: Server sleep sau 15 phút không hoạt động
- **Giải pháp**: 
  - Chấp nhận (miễn phí mà!)
  - Hoặc upgrade lên paid plan ($7/tháng) để không bao giờ sleep
  - Hoặc dùng uptime monitoring service (như UptimeRobot) để ping server mỗi 10 phút

### Port already in use
- **Vấn đề**: Port 3000 đã được sử dụng
- **Giải pháp**: 
```bash
# Kill process đang dùng port 3000
killall node
# Hoặc
lsof -ti:3000 | xargs kill -9
```

### Build failed
- **Vấn đề**: npm install fails
- **Giải pháp**: Kiểm tra Node version (cần >= 14)
```bash
node --version
```

---

## 📞 Support

Nếu gặp vấn đề khi deploy:
1. Kiểm tra logs của platform
2. Đảm bảo `package.json` có đúng dependencies
3. Test local trước: `npm start`
4. Kiểm tra file `render.yaml` hoặc `railway.json`

---

## 🎉 Kết luận

Sau khi deploy thành công, bạn sẽ có:
- ✅ URL public để truy cập từ bất kỳ đâu
- ✅ HTTPS bảo mật
- ✅ Tự động restart nếu có lỗi
- ✅ Free hosting!

**Example URLs sau khi deploy:**
- Render: `https://ai-product-analyzer.onrender.com`
- Railway: `https://ai-product-analyzer.up.railway.app`
- Vercel: `https://ai-product-analyzer.vercel.app`

Chúc bạn deploy thành công! 🚀
