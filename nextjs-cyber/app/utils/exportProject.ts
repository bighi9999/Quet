import JSZip from 'jszip'
import { saveAs } from 'file-saver'

interface ExportData {
  projectName: string
  originalImage?: string
  generatedImages: Array<{ name: string; data: string }>
  marketingContent: {
    shopee?: string
    facebook?: string
    instagram?: string
    videoScript?: string
    headlines?: string[]
  }
  analysisResult?: any
}

export async function exportProjectAsZip(data: ExportData): Promise<void> {
  const zip = new JSZip()
  
  console.log('[Export] Creating ZIP archive for:', data.projectName)

  // Create main folder
  const projectFolder = zip.folder(data.projectName)
  if (!projectFolder) {
    throw new Error('Failed to create project folder')
  }

  // 1. Add original image
  if (data.originalImage) {
    const imageData = data.originalImage.split(',')[1] || data.originalImage
    projectFolder.file('01_original_image.jpg', imageData, { base64: true })
    console.log('[Export] ✓ Added original image')
  }

  // 2. Add generated images
  if (data.generatedImages.length > 0) {
    const imagesFolder = projectFolder.folder('02_generated_images')
    if (imagesFolder) {
      data.generatedImages.forEach((img, index) => {
        const imageData = img.data.split(',')[1] || img.data
        const fileName = img.name || `generated_${index + 1}.jpg`
        imagesFolder.file(fileName, imageData, { base64: true })
      })
      console.log('[Export] ✓ Added', data.generatedImages.length, 'generated images')
    }
  }

  // 3. Add marketing content as text files
  const contentFolder = projectFolder.folder('03_marketing_content')
  if (contentFolder) {
    // Shopee content
    if (data.marketingContent.shopee) {
      contentFolder.file('shopee_description.txt', data.marketingContent.shopee)
    }

    // Facebook content
    if (data.marketingContent.facebook) {
      contentFolder.file('facebook_post.txt', data.marketingContent.facebook)
    }

    // Instagram content
    if (data.marketingContent.instagram) {
      contentFolder.file('instagram_caption.txt', data.marketingContent.instagram)
    }

    // Video script
    if (data.marketingContent.videoScript) {
      contentFolder.file('video_script.txt', data.marketingContent.videoScript)
    }

    // Headlines
    if (data.marketingContent.headlines && data.marketingContent.headlines.length > 0) {
      const headlinesText = data.marketingContent.headlines.join('\n\n')
      contentFolder.file('headlines_and_hooks.txt', headlinesText)
    }

    console.log('[Export] ✓ Added marketing content')
  }

  // 4. Add analysis result as JSON
  if (data.analysisResult) {
    projectFolder.file('analysis_data.json', JSON.stringify(data.analysisResult, null, 2))
    console.log('[Export] ✓ Added analysis data')
  }

  // 5. Create README file
  const readme = createReadme(data)
  projectFolder.file('README.txt', readme)

  // Generate ZIP file
  console.log('[Export] Generating ZIP file...')
  const zipBlob = await zip.generateAsync({ 
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  })

  const fileName = `${sanitizeFileName(data.projectName)}_${Date.now()}.zip`
  
  // Download
  saveAs(zipBlob, fileName)
  console.log('[Export] ✓ ZIP downloaded:', fileName)
}

function createReadme(data: ExportData): string {
  const date = new Date().toLocaleString('vi-VN')
  
  return `╔══════════════════════════════════════════════════════════════╗
║          BG AI TOOLS - DỰ ÁN XUẤT FILE                      ║
╚══════════════════════════════════════════════════════════════╝

TÊN DỰ ÁN: ${data.projectName}
NGÀY XUẤT: ${date}
NGUỒN: https://mochiphoto.click

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📂 CẤU TRÚC THÚ MỤC:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 ${data.projectName}/
  ├─ 📄 01_original_image.jpg        (Ảnh sản phẩm gốc)
  ├─ 📁 02_generated_images/         (Ảnh AI đã tạo)
  │   ├─ generated_1.jpg
  │   ├─ generated_2.jpg
  │   └─ ...
  ├─ 📁 03_marketing_content/        (Nội dung quảng cáo)
  │   ├─ shopee_description.txt      (Mô tả sản phẩm Shopee)
  │   ├─ facebook_post.txt           (Bài đăng Facebook)
  │   ├─ instagram_caption.txt       (Caption Instagram)
  │   ├─ video_script.txt            (Kịch bản video)
  │   └─ headlines_and_hooks.txt     (Tiêu đề & Hook)
  ├─ 📄 analysis_data.json           (Dữ liệu phân tích chi tiết)
  └─ 📄 README.txt                   (File này)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 HƯỚNG DẪN SỬ DỤNG:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. UPLOAD ẢNH LÊN SHOPEE/LAZADA:
   • Sử dụng ảnh trong thư mục "02_generated_images"
   • Chọn ảnh có góc chụp phù hợp nhất

2. ĐĂNG BÀI FACEBOOK/INSTAGRAM:
   • Copy nội dung từ file tương ứng
   • Chỉnh sửa nhẹ nếu cần
   • Kèm hashtag và emoji

3. TẠO VIDEO TIKTOK/REELS:
   • Làm theo kịch bản trong "video_script.txt"
   • Quay các cảnh theo từng bước
   • Thêm nhạc nền trending

4. CHẠY QUẢNG CÁO:
   • Dùng tiêu đề trong "headlines_and_hooks.txt"
   • Test A/B nhiều phiên bản
   • Theo dõi CTR và conversion

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ THÔNG SỐ KỸ THUẬT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• AI Models: Gemini 2.5 Flash, Qwen2-VL, Llama 3.2
• Image Generator: Pollinations AI / Flux
• Content Generator: Google Gemini + Vietnamese Localization
• Quality: High Resolution (1920px max)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📞 HỖ TRỢ:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Website: https://mochiphoto.click
GitHub: https://github.com/bighi9999/Quet
Version: v3.2.0

Cảm ơn bạn đã sử dụng BG AI Tools! 🚀
`
}

function sanitizeFileName(name: string): string {
  return name
    .replace(/[^a-z0-9_\-]/gi, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 50)
}
