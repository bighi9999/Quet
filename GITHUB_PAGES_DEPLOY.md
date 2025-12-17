# 🚀 Deploy lên GitHub Pages + Vercel (100% Miễn Phí)

## 🎯 **KIẾN TRÚC DEPLOY**

```
┌─────────────────────────────────────────────────────────────┐
│  Frontend (GitHub Pages)         Backend (Vercel)           │
│  https://bighi9999.github.io/    https://quet.vercel.app/   │
│  └─ Static HTML/CSS/JS           └─ Serverless API          │
│     • v2.html                       • /api/analyze          │
│     • v1.html                       • /api/generate         │
│     • access.html                                           │
└─────────────────────────────────────────────────────────────┘
```

**Lợi ích**:
- ✅ 100% miễn phí
- ✅ Frontend siêu nhanh (GitHub CDN)
- ✅ Backend serverless (Vercel)
- ✅ Auto-deploy từ GitHub
- ✅ No sleep, luôn online
- ✅ Không cần quản lý server

---

## 📦 **PHẦN 1: DEPLOY FRONTEND LÊN GITHUB PAGES**

### **Bước 1: Enable GitHub Pages**

1. Truy cập: https://github.com/bighi9999/Quet/settings/pages
2. **Source**: Deploy from a branch
3. **Branch**: `main`
4. **Folder**: `/root` hoặc `/docs` (tùy chọn)
5. Click **Save**

### **Bước 2: Đợi Deploy**

- GitHub tự động build và deploy
- Thời gian: 1-2 phút
- URL: `https://bighi9999.github.io/Quet/`

### **Bước 3: Truy Cập Webapp**

```
Homepage:     https://bighi9999.github.io/Quet/
V2 Pro:       https://bighi9999.github.io/Quet/v2.html
V1 Classic:   https://bighi9999.github.io/Quet/v1.html
Access Portal: https://bighi9999.github.io/Quet/access.html
```

---

## 🔧 **PHẦN 2: DEPLOY BACKEND API LÊN VERCEL**

### **Bước 1: Tạo Tài Khoản Vercel**

1. Truy cập: https://vercel.com/signup
2. **Sign up with GitHub**
3. Authorize Vercel

### **Bước 2: Import Project**

1. Dashboard: https://vercel.com/new
2. Click **Import Project**
3. Import Git Repository
4. Select: **bighi9999/Quet**
5. Click **Import**

### **Bước 3: Cấu Hình Project**

```
Project Name: quet
Framework Preset: Other
Root Directory: ./
Build Command: (để trống)
Output Directory: (để trống)
Install Command: npm install
```

### **Bước 4: Environment Variables**

**⚠️ QUAN TRỌNG**: Không cần environment variables!
- OpenAI API key do **user nhập** từ frontend
- Không có secrets cần giữ

### **Bước 5: Deploy**

1. Click **Deploy**
2. Đợi 1-2 phút
3. Backend API sẽ live tại:
   - `https://quet.vercel.app/api/analyze`
   - `https://quet.vercel.app/api/generate`

---

## 🔗 **PHẦN 3: KẾT NỐI FRONTEND VỚI BACKEND**

### **Vấn đề**: Frontend (GitHub Pages) gọi API Backend (Vercel)

**Giải pháp**: Cập nhật API URLs trong frontend

File cần sửa: `public/v2.html`

**Tìm và thay thế**:
```javascript
// CŨ (relative paths)
const response = await fetch('/api/analyze', {...});

// MỚI (absolute Vercel URL)
const API_BASE = 'https://quet.vercel.app';
const response = await fetch(`${API_BASE}/api/analyze`, {...});
```

---

## 🛠️ **CÁCH SỬA NHANH (Tôi sẽ làm giúp)**

Tôi sẽ tạo file `public/config.js`:

```javascript
// config.js
const CONFIG = {
  API_BASE_URL: 'https://quet.vercel.app'
};
```

Sau đó include trong HTML:
```html
<script src="config.js"></script>
```

Và sử dụng:
```javascript
fetch(`${CONFIG.API_BASE_URL}/api/analyze`, {...});
```

---

## 🚀 **PHƯƠNG ÁN ĐƠN GIẢN HƠN: CHỈ DÙNG VERCEL**

**Vercel miễn phí và có thể host CẢ frontend + backend!**

### **Lợi ích**:
- ✅ Chỉ 1 domain: `https://quet.vercel.app/`
- ✅ Không cần config API URLs
- ✅ Tự động HTTPS + CDN
- ✅ Deploy 1 lần, xong việc

### **Cách deploy**:

1. Truy cập: https://vercel.com/new
2. Import: `bighi9999/Quet`
3. Cấu hình:
   ```
   Framework: Other
   Build Command: (để trống)
   Output Directory: public
   Install Command: npm install
   ```
4. Deploy!

**URL sẽ là**:
- Frontend: `https://quet.vercel.app/v2.html`
- API: `https://quet.vercel.app/api/analyze`

---

## 🎯 **KHUYẾN NGHỊ: DÙNG VERCEL (Đơn giản nhất)**

**Vì sao?**
1. ✅ Miễn phí 100%
2. ✅ Host cả frontend + backend
3. ✅ Không cần config API URLs
4. ✅ Auto-deploy từ GitHub
5. ✅ Serverless functions built-in
6. ✅ Global CDN
7. ✅ Custom domain miễn phí
8. ✅ No sleep, luôn online

**Vercel tốt hơn GitHub Pages + Vercel!**

---

## 📋 **HƯỚNG DẪN DEPLOY VERCEL (5 PHÚT)**

### **Bước 1: Sign up Vercel**
👉 https://vercel.com/signup (dùng GitHub)

### **Bước 2: Import Project**
👉 https://vercel.com/new
- Select: `bighi9999/Quet`

### **Bước 3: Cấu hình**
```
Framework: Other
Root: ./
Build: (để trống)
Output: public
Install: npm install
```

### **Bước 4: Deploy**
- Click Deploy
- Đợi 1-2 phút

### **Bước 5: Truy cập**
```
Production: https://quet.vercel.app/v2.html
API:        https://quet.vercel.app/api/analyze
```

---

## ✅ **CHECKLIST**

- [ ] Sign up Vercel với GitHub
- [ ] Import repository: bighi9999/Quet
- [ ] Cấu hình: Output = public
- [ ] Deploy
- [ ] Test: https://quet.vercel.app/v2.html
- [ ] Test API với OpenAI key
- [ ] Test upload ảnh
- [ ] Test generate ảnh

---

## 💰 **CHI PHÍ**

**Vercel Free Tier**:
- ✅ Miễn phí 100%
- ✅ 100GB bandwidth/tháng
- ✅ Unlimited requests
- ✅ Serverless functions
- ✅ Auto-deploy
- ✅ Custom domain
- ✅ No sleep

**OpenAI API**:
- User tự trả: ~$0.05 per workflow

**Tổng chi phí hosting**: **$0.00/tháng** 🎉

---

## 🔍 **SO SÁNH CÁC PHƯƠNG ÁN**

| Phương án | Độ khó | Tốc độ | Chi phí | Recommend |
|-----------|---------|---------|---------|-----------|
| Vercel (All-in-one) | ⭐ Dễ | ⚡ Nhanh | 💰 Free | ✅ **TỐT NHẤT** |
| GitHub Pages + Vercel | ⭐⭐ Trung bình | ⚡ Nhanh | 💰 Free | ⚠️ Phức tạp |
| Cloudflare Pages | ⭐⭐⭐ Khó | ⚡⚡ Rất nhanh | 💰 Free | ⚠️ Cần config |
| Render.com | ⭐ Dễ | 🐌 Chậm (sleep) | 💰 Free | ❌ Không recommend |

---

## 🚀 **KẾT LUẬN**

**DEPLOY LÊN VERCEL** - Đơn giản, nhanh, miễn phí!

👉 Truy cập: https://vercel.com/new  
👉 Import: bighi9999/Quet  
👉 Deploy!  

**Thời gian: 3 phút** ⏱️

---

Bạn muốn tôi:
1. ✅ Hướng dẫn deploy Vercel chi tiết
2. ✅ Hoặc tự động config và push để bạn chỉ cần deploy?

Cho tôi biết nhé! 🚀
