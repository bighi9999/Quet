# ⚡ Quick Start Guide

Hướng dẫn nhanh để bắt đầu sử dụng AI Product Image Analyzer trong 5 phút!

---

## 🎯 Mục tiêu
Phân tích ảnh sản phẩm bằng AI → Nhận prompt đề xuất → Tạo ảnh mới

---

## 📝 Chuẩn bị (2 phút)

### 1. Lấy OpenAI API Key
```
1. Truy cập: https://platform.openai.com/api-keys
2. Đăng nhập (hoặc tạo tài khoản)
3. Click "Create new secret key"
4. Copy key (bắt đầu bằng sk-...)
5. Lưu lại để dùng
```

### 2. Khởi chạy ứng dụng

**Nếu đã deploy:**
- Truy cập URL của bạn (vd: `https://your-app.onrender.com`)

**Nếu chạy local:**
```bash
npm install
npm start
# Mở: http://localhost:3000
```

---

## 🚀 Sử dụng (3 phút)

### Bước 1: Nhập API Key (10 giây)
![Step 1](https://via.placeholder.com/600x100/667eea/ffffff?text=Paste+API+Key+Here)

Paste API key vào ô đầu tiên trên trang

### Bước 2: Upload ảnh (10 giây)
![Step 2](https://via.placeholder.com/600x200/764ba2/ffffff?text=Drag+Drop+Image+Here)

**2 cách:**
- Kéo thả ảnh vào vùng upload
- Click "Chọn ảnh" để browse

### Bước 3: Phân tích (15 giây)
![Step 3](https://via.placeholder.com/600x100/667eea/ffffff?text=Click+Analyze+Button)

Click nút **"🔍 Phân tích ảnh"**

Đợi AI phân tích → Xem kết quả chi tiết

### Bước 4: Chọn prompt (5 giây)
![Step 4](https://via.placeholder.com/600x300/ffd89b/333333?text=Select+Your+Favorite+Prompt)

Click vào 1 trong 3 prompt được tạo ra

### Bước 5: Tạo ảnh (30 giây)
![Step 5](https://via.placeholder.com/600x100/f093fb/ffffff?text=Generate+AI+Image)

Click **"🎨 Tạo ảnh từ prompt đã chọn"**

Đợi DALL-E tạo ảnh → Xem so sánh!

### Bước 6: So sánh kết quả
![Step 6](https://via.placeholder.com/800x400/a8edea/333333?text=Original+vs+AI+Generated)

Xem ảnh gốc vs ảnh AI cạnh nhau

---

## 💡 Tips & Tricks

### 🎨 Để có kết quả tốt nhất:
- ✅ Chọn ảnh rõ nét, ánh sáng tốt
- ✅ Sản phẩm là focus chính trong ảnh
- ✅ Đọc kỹ 3 prompts trước khi chọn
- ✅ Thử các prompt khác nhau để so sánh

### 💰 Tiết kiệm chi phí:
- ✅ Mỗi lần phân tích: ~$0.01
- ✅ Mỗi lần tạo ảnh: ~$0.04
- ✅ Chọn prompt cẩn thận trước khi generate
- ✅ Không spam analyze button

### 🔒 Bảo mật:
- ✅ API key chỉ lưu trong memory
- ✅ Không lưu trên server
- ✅ Mỗi lần refresh cần nhập lại
- ✅ An toàn 100%

---

## 🎯 Use Cases

### 1. E-commerce
**Mục đích:** Tạo ảnh sản phẩm đa dạng cho shop
```
Upload ảnh sản phẩm → AI suggest styles → Generate variations
```

### 2. Marketing
**Mục đích:** Tạo ảnh cho campaign
```
Upload reference image → Get creative prompts → Generate marketing images
```

### 3. Product Photography
**Mục đích:** Brainstorm ideas cho photoshoot
```
Upload sample → Analyze style → Get prompt ideas → Plan shoot
```

### 4. Design Inspiration
**Mục đích:** Tìm ý tưởng thiết kế
```
Upload existing design → AI analyze → Generate variations → Pick favorites
```

---

## 🐛 Xử lý lỗi thường gặp

### ❌ "API key is required"
**Giải pháp:** Nhập API key vào ô input trên cùng

### ❌ "Failed to analyze"
**Nguyên nhân:** API key sai hoặc hết quota
**Giải pháp:** 
1. Check API key
2. Kiểm tra billing: https://platform.openai.com/account/billing
3. Thử lại

### ❌ "Image too large"
**Giải pháp:** 
- Resize ảnh < 10MB
- Dùng tools: https://tinypng.com/

### ❌ Trang load chậm
**Nguyên nhân:** Server đang sleep (Render.com free tier)
**Giải pháp:** Đợi 30 giây cho server wake up

---

## 📊 Workflow Example

```
1. Có ảnh sản phẩm áo thun
   ↓
2. Upload lên app
   ↓
3. AI phân tích: "White t-shirt, minimalist, studio lighting..."
   ↓
4. Nhận 3 prompts:
   - Prompt 1: "Same shirt in colorful background..."
   - Prompt 2: "T-shirt with model in urban setting..."
   - Prompt 3: "Product flat lay with accessories..."
   ↓
5. Chọn Prompt 2
   ↓
6. DALL-E tạo ảnh áo với model + urban background
   ↓
7. Download và sử dụng cho marketing!
```

---

## ⚡ Keyboard Shortcuts

Hiện tại chưa có, nhưng sẽ có trong phiên bản tương lai:
- `Ctrl/Cmd + U` - Upload image
- `Ctrl/Cmd + A` - Analyze
- `Ctrl/Cmd + G` - Generate
- `Ctrl/Cmd + R` - Reset

---

## 📞 Cần giúp đỡ?

1. **Đọc README.md** - Hướng dẫn chi tiết
2. **Đọc DEPLOYMENT.md** - Nếu muốn deploy
3. **Check Issues** - Trên GitHub
4. **Create Issue** - Nếu gặp bug mới

---

## 🎉 Xong!

Bạn đã biết cách sử dụng AI Product Image Analyzer!

**Next steps:**
- 🚀 Deploy lên Render.com (xem DEPLOYMENT.md)
- 🎨 Thử với nhiều loại ảnh khác nhau
- 📊 Monitor API usage trên OpenAI dashboard
- ⭐ Star repo nếu thích!

---

**Happy analyzing! 🎨✨**
