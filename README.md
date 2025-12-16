# AI Product Image Analyzer & Generator

Ứng dụng web sử dụng AI để phân tích ảnh sản phẩm và tạo prompt đề xuất để sinh ảnh mới bằng OpenAI API.

## Tính năng

✨ **Phân tích ảnh thông minh**
- Upload ảnh sản phẩm (kéo thả hoặc chọn file)
- Phân tích chi tiết bằng GPT-4 Vision:
  - Mô tả sản phẩm
  - Đặc điểm hình ảnh (màu sắc, hình dạng, chất liệu)
  - Ánh sáng và composition
  - Background và setting
  - Mood và chất lượng tổng thể

🎨 **Tạo prompt AI**
- Tự động tạo 3 prompt đề xuất sáng tạo
- Mỗi prompt được tối ưu cho việc sinh ảnh AI
- Chọn prompt và tạo ảnh ngay lập tức

🖼️ **Sinh ảnh bằng DALL-E 3**
- Tạo ảnh chất lượng cao (1024x1024)
- So sánh ảnh gốc và ảnh AI sinh ra
- Xem prompt đã được tối ưu bởi DALL-E

## Cài đặt

### Yêu cầu
- Node.js (v14 trở lên)
- OpenAI API Key ([Lấy tại đây](https://platform.openai.com/api-keys))

### Các bước cài đặt

1. Clone repository hoặc tải mã nguồn

2. Cài đặt dependencies:
```bash
npm install
```

3. (Tùy chọn) Tạo file .env từ .env.example:
```bash
cp .env.example .env
```

4. Khởi chạy server:
```bash
npm start
```

5. Mở trình duyệt và truy cập: `http://localhost:3000`

## Sử dụng

1. **Nhập API Key**: Nhập OpenAI API key vào ô input (hoặc cấu hình trong file .env)
2. **Upload ảnh**: Kéo thả hoặc chọn ảnh sản phẩm cần phân tích
3. **Phân tích**: Click "Phân tích ảnh" để AI phân tích ảnh
4. **Chọn prompt**: Chọn một trong 3 prompt đề xuất
5. **Tạo ảnh**: Click "Tạo ảnh từ prompt đã chọn"
6. **Xem kết quả**: So sánh ảnh gốc và ảnh AI đã tạo

## Công nghệ sử dụng

### Backend
- **Node.js & Express**: Server framework
- **Multer**: Upload và xử lý file
- **Axios**: HTTP client cho API calls
- **dotenv**: Quản lý environment variables

### Frontend
- **Vanilla JavaScript**: Logic và tương tác
- **CSS3**: Gradient backgrounds, animations
- **Responsive Design**: Tương thích mobile

### AI Services
- **GPT-4 Vision (gpt-4o)**: Phân tích ảnh
- **DALL-E 3**: Sinh ảnh từ text

## API Endpoints

### POST /api/analyze
Phân tích ảnh sản phẩm và tạo prompt đề xuất

**Request:**
- `image`: File ảnh (multipart/form-data)
- `apiKey`: OpenAI API key

**Response:**
```json
{
  "success": true,
  "imageUrl": "/uploads/product-xxx.jpg",
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
      "prompt": "Detailed prompt text..."
    }
  ]
}
```

### POST /api/generate
Tạo ảnh từ prompt sử dụng DALL-E 3

**Request:**
```json
{
  "prompt": "Your detailed prompt here",
  "apiKey": "sk-..."
}
```

**Response:**
```json
{
  "success": true,
  "imageUrl": "https://...",
  "revisedPrompt": "DALL-E optimized prompt"
}
```

## Bảo mật

- API key được truyền qua HTTPS và không lưu trữ
- File upload được validate (chỉ chấp nhận ảnh)
- Giới hạn kích thước file: 10MB
- Rate limiting có thể được thêm vào production

## Giới hạn

- OpenAI API có rate limits theo plan
- DALL-E 3: ~$0.04 per image (1024x1024)
- GPT-4 Vision: ~$0.01 per image analysis

## License

MIT License

## Tác giả

Phát triển bởi AI Assistant
