# 🎨 AI FASHION MODEL GENERATOR - BG Ai Tools

## 📋 TỔNG QUAN (OVERVIEW)

Tính năng **AI Fashion Model Generator** cho phép người dùng tạo prompt chuyên nghiệp để generate hình ảnh người mẫu mặc sản phẩm thời trang với các tùy chọn tùy biến chi tiết.

**The AI Fashion Model Generator** feature allows users to create professional prompts for generating images of models wearing fashion products with detailed customization options.

---

## ✨ TÍNH NĂNG CHÍNH (KEY FEATURES)

### 1. 🔍 Tự Động Phát Hiện Thời Trang (Auto Fashion Detection)
- Hệ thống tự động phát hiện khi ảnh upload là sản phẩm thời trang
- Hiển thị form tùy chọn chỉ khi phát hiện category "Fashion Item"
- **System automatically detects fashion products from uploaded images**
- **Form appears only when "Fashion Item" category is detected**

### 2. 🎛️ Form Tùy Chỉnh Người Mẫu (Model Customization Form)

#### Các Tùy Chọn (Options):

**A. Giới Tính (Gender):**
- 👨 Nam (Male)
- 👩 Nữ (Female)  
- 🧑 Unisex

**B. Quốc Gia/Sắc Tộc (Ethnicity):**
- 🇻🇳 Việt Nam (Vietnamese)
- 🇰🇷 Hàn Quốc (Korean)
- 🇺🇸 Âu Mỹ (Caucasian)
- 🌎 Latin

**C. Độ Tuổi (Age Group):**
- Gen Z (18-24 tuổi / years old)
- Trưởng thành (25-35 tuổi / years old)
- Trung niên (36-45 tuổi / years old)

**D. Bối Cảnh (Background):**
- 📷 Studio Phông Trắng (White Studio Background)
- 🏙️ Đường Phố Sài Gòn (Saigon Street)
- ☕ Cafe Sang Trọng (Luxury Cafe)
- 🌌 Studio Cyberpunk

**E. Góc Chụp (Shot Type):**
- 🧍 Toàn thân (Full Body Shot)
- 🤳 Chân dung (Portrait - Upper Body)

### 3. 🌐 Hệ Thống Prompt Song Ngữ (Bilingual Prompt System)

#### Prompt Tiếng Anh (English Prompt) - Chính (Primary):
```
Full body shot of a 22 year old Vietnamese female model wearing white t-shirt, 
posing in white studio background, professional photography, studio lighting, 
fashion editorial, 8k resolution, photorealistic, high fashion, detailed texture
```

**Công Thức (Formula):**
```
[Shot Type] of a [Age] year old [Ethnicity] [Gender] model wearing [Product], 
posing in [Background], professional photography, studio lighting, fashion editorial, 
8k resolution, photorealistic, high fashion, detailed texture
```

#### Bản Dịch Tiếng Việt (Vietnamese Translation) - Tham Khảo (Reference):
```
Ảnh chụp toàn thân của người mẫu nữ Việt Nam 22 tuổi mặc white t-shirt, 
chụp tại studio phông trắng, nhiếp ảnh chuyên nghiệp, ánh sáng studio, 
phong cách thời trang cao cấp, độ phân giải 8k, ảnh thực tế, chi tiết sắc nét
```

### 4. 📋 Chức Năng Copy Prompt (Copy Functionality)
- Nút copy nhanh cho prompt tiếng Anh
- Dùng trực tiếp cho Midjourney, DALL-E, Stable Diffusion
- **Quick copy button for English prompts**
- **Direct use with AI image generation tools**

### 5. 🔄 Tích Hợp Từ Điển Dịch Thuật (Translation Dictionary)

```javascript
const translations = {
  'High Resolution': 'Độ Phân Giải Cao',
  'Modern Design': 'Thiết Kế Hiện Đại',
  'Premium Material': 'Chất Liệu Cao Cấp',
  'Professional': 'Chuyên Nghiệp',
  'Minimalist': 'Tối Giản',
  'Elegant': 'Sang Trọng',
  'Casual': 'Năng Động',
  'Luxury': 'Cao Cấp',
  'Fashion Item': 'Thời Trang',
  'Clothing': 'Quần Áo',
  // ... more translations
}
```

---

## 🎯 QUY TRÌNH SỬ DỤNG (USER WORKFLOW)

### Bước 1: Tải Ảnh Lên (Upload Image)
```
User kéo thả hoặc chọn file ảnh sản phẩm thời trang
(User drags or selects fashion product image file)
```

### Bước 2: Phân Tích Tự Động (Auto Analysis)
```
Hệ thống phân tích và phát hiện category = "Fashion Item"
(System analyzes and detects category = "Fashion Item")
```

### Bước 3: Hiển Thị Form (Form Appears)
```
Form tùy chọn người mẫu tự động hiển thị
(Model customization form automatically appears)
```

### Bước 4: Tùy Chỉnh (Customize)
```
User chọn: Nữ, Việt Nam, Gen Z, Studio Phông Trắng, Toàn Thân
(User selects: Female, Vietnamese, Gen Z, White Studio, Full Body)
```

### Bước 5: Tạo Prompt (Generate Prompt)
```
Click nút "TẠO PROMPT NGƯỜI MẪU"
(Click "GENERATE MODEL PROMPT" button)
```

### Bước 6: Copy & Sử Dụng (Copy & Use)
```
Copy prompt tiếng Anh → Paste vào Midjourney/DALL-E
(Copy English prompt → Paste into Midjourney/DALL-E)
```

---

## 💻 KỸ THUẬT TRIỂN KHAI (TECHNICAL IMPLEMENTATION)

### State Management:
```typescript
const [showFashionForm, setShowFashionForm] = useState(false)
const [fashionOptions, setFashionOptions] = useState({
  gender: 'female',
  ethnicity: 'vietnam',
  ageGroup: 'genz',
  background: 'studio',
  shotType: 'full'
})
const [fashionPrompt, setFashionPrompt] = useState({ en: '', vi: '' })
```

### Core Function:
```typescript
const generateFashionPrompt = (productDesc: string, options: FashionOptions) => {
  // Mapping dictionaries for each option
  const genderMap = { male: {en: 'male', vi: 'nam'}, ... }
  const ethnicityMap = { vietnam: {en: 'Vietnamese', vi: 'Việt Nam'}, ... }
  // ... more maps
  
  // Generate bilingual prompts
  const promptEN = `${shot.en} of a ${age.en} ${ethnicity.en} ${gender.en} model...`
  const promptVI = `${shot.vi} của người mẫu ${gender.vi} ${ethnicity.vi}...`
  
  return { en: promptEN, vi: promptVI }
}
```

### Fashion Detection Logic:
```typescript
// In handleAnalyze()
const isFashionItem = // AI detection or category check
const mockResult = {
  productType: isFashionItem ? 'Fashion Item' : 'Electronics Device',
  // ...
  isFashion: isFashionItem
}
setShowFashionForm(isFashionItem)
```

---

## 🎨 GIAO DIỆN (UI/UX DESIGN)

### Theme: Hacker/Cyberpunk Style
```css
- Background: Black (#000000)
- Primary Color: Cyan (#00FFFF)  
- Border: Neon glow effect
- Font: JetBrains Mono (Monospace)
- Accent: Yellow (#FFD700) for warnings
```

### Components:
1. **Form Header:** Icon User + "TẠO NGƯỜI MẪU AI" (Yellow)
2. **Select Dropdowns:** 
   - Black background
   - Cyan borders
   - Monospace font
   - Full width responsive
3. **Generate Button:**
   - Camera icon
   - Full width
   - Hover effect: cyan glow
4. **Prompt Display:**
   - English: Cyan border, primary
   - Vietnamese: Gray border, secondary
   - Copy button on each prompt

---

## 📊 USE CASES (TÌNH HUỐNG SỬ DỤNG)

### Case 1: Designer Thời Trang (Fashion Designer)
```
Cần tạo mockup áo thun với người mẫu Việt Nam Gen Z
→ Upload ảnh áo → Chọn options → Generate → Copy prompt → Midjourney
(Need to create t-shirt mockup with Vietnamese Gen Z model)
```

### Case 2: E-commerce Shop Owner
```
Cần ảnh sản phẩm với người mẫu phù hợp target audience
→ Upload product → Select demographics → Generate → Use for product photos
(Need product photos with models matching target audience)
```

### Case 3: Marketing Agency
```
Campaign cho thương hiệu Việt Nam, cần model địa phương
→ Upload clothes → Select Vietnamese ethnicity → Generate localized prompts
(Campaign for Vietnamese brand, need local models)
```

### Case 4: Content Creator
```
Tạo nội dung Instagram với phong cách street style Sài Gòn
→ Upload outfit → Select Saigon street background → Generate urban prompts
(Create Instagram content with Saigon street style)
```

---

## 🔧 CẤU HÌNH MÔ HÌNH AI (AI MODEL CONFIGURATION)

### Recommended Settings for AI Tools:

#### Midjourney:
```
/imagine [Paste English Prompt] --ar 2:3 --v 6 --style raw
```

#### DALL-E 3:
```
Paste English Prompt
Quality: HD
Size: Portrait (1024x1792)
```

#### Stable Diffusion:
```
Positive Prompt: [Paste English Prompt]
Negative Prompt: blurry, low quality, distorted, amateur
Steps: 30-50
CFG Scale: 7-10
Sampler: DPM++ 2M Karras
```

---

## 🌟 LỢI ÍCH (BENEFITS)

### Cho Designer/Photographer:
- ⚡ Tạo prompt chuyên nghiệp nhanh chóng
- 🎯 Tùy chỉnh chi tiết theo yêu cầu
- 🌐 Phù hợp với thị trường địa phương (VN, KR, US)
- 💰 Tiết kiệm chi phí photoshoot thật

### Cho E-commerce:
- 📸 Tạo ảnh sản phẩm đa dạng
- 👥 Đúng target demographics
- 🚀 Scale nhanh cho nhiều sản phẩm
- 💵 ROI cao hơn traditional photography

### Cho Marketing:
- 🎨 Creative flexibility
- 📊 A/B testing dễ dàng
- 🌍 Đa quốc gia, đa sắc tộc
- ⏰ Turnaround time cực nhanh

---

## 📈 ROADMAP (KẾ HOẠCH PHÁT TRIỂN)

### Version 2.0 (Q1 2025):
- [ ] Tích hợp thực tế với Gemini Vision API
- [ ] Real fashion detection (không mock)
- [ ] Thêm tùy chọn: Pose, Expression, Lighting
- [ ] History lưu prompts đã tạo

### Version 2.5 (Q2 2025):
- [ ] Tích hợp trực tiếp Midjourney API
- [ ] Preview thumbnail generated images
- [ ] Batch generation (nhiều variants)
- [ ] Template library

### Version 3.0 (Q3 2025):
- [ ] AI-powered outfit matching
- [ ] Style transfer từ reference images
- [ ] Multi-model comparison
- [ ] Enterprise features (team collaboration)

---

## 🐛 TROUBLESHOOTING

### Issue 1: Form không hiện
```
Cause: Category không phải "Fashion Item"
Fix: Tạm thời set isFashionItem = true để test
```

### Issue 2: Prompt không generate
```
Cause: Missing fashionOptions state
Fix: Check useState initialization
```

### Issue 3: Copy không hoạt động
```
Cause: Clipboard API not supported
Fix: Fallback to execCommand('copy')
```

---

## 📞 HỖ TRỢ (SUPPORT)

- 📧 Email: support@bgaitools.com
- 🌐 Website: http://14.225.210.195:3000
- 💬 GitHub Issues: https://github.com/bighi9999/Quet/issues

---

## 📄 LICENSE

MIT License - BG AI Tools © 2025

---

**Phát triển bởi (Developed by):** BG AI Tools Team  
**Ngày cập nhật (Last Updated):** 2025-12-17  
**Phiên bản (Version):** 2.1.0
