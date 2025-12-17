'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Terminal, Upload, Cpu, Server, Database, Shield, 
  Activity, Zap, Eye, Brain, Image as ImageIcon,
  Check, AlertCircle, Loader2, Copy, ChevronRight,
  User, MapPin, Calendar, Camera, Globe,
  Megaphone, ShoppingBag, MessageCircle, Instagram,
  Sparkles, Download
} from 'lucide-react'

export default function CyberWebapp() {
  const [bootComplete, setBootComplete] = useState(false)
  const [bootProgress, setBootProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [isDragging, setIsDragging] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [showFashionForm, setShowFashionForm] = useState(false)
  const [fashionOptions, setFashionOptions] = useState({
    gender: 'female',
    ethnicity: 'vietnam',
    ageGroup: 'genz',
    background: 'studio',
    shotType: 'full'
  })
  const [fashionPrompt, setFashionPrompt] = useState({ en: '', vi: '' })
  const [showVietnamese, setShowVietnamese] = useState(false)
  const [marketingContent, setMarketingContent] = useState<any>(null)
  const [isGeneratingMarketing, setIsGeneratingMarketing] = useState(false)
  const [isGeneratingModel, setIsGeneratingModel] = useState(false)
  const [generatedModelImage, setGeneratedModelImage] = useState<string>('')

  // Boot sequence animation
  useEffect(() => {
    const bootMessages = [
      'Đang khởi tạo lõi hệ thống BG Ai...',
      'Đang bỏ qua các giao thức bảo mật...',
      'Đang kết nối mạng nơ-ron đa chiều...',
      'Tải dữ liệu máy chủ thành công.',
      'QUYỀN TRUY CẬP ĐƯỢC CHẤP NHẬN.',
    ]

    let messageIndex = 0
    const interval = setInterval(() => {
      setBootProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setBootComplete(true), 500)
          return 100
        }
        messageIndex++
        return prev + 20
      })
    }, 600)

    return () => clearInterval(interval)
  }, [])

  // Handle file selection
  const handleFileChange = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileChange(file)
  }, [handleFileChange])

  // Handle file input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileChange(file)
  }

  // Simulate AI analysis
  const handleAnalyze = async () => {
    if (!selectedFile) return

    setIsAnalyzing(true)
    setAnalysisResult(null)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Mock result - detect fashion items
    const isFashionItem = Math.random() > 0.5 // Simulate fashion detection
    const mockResult = {
      productType: isFashionItem ? 'Fashion Item' : 'Electronics Device',
      keyFeatures: isFashionItem 
        ? ['Premium Material', 'Modern Design', 'Elegant']
        : ['High Resolution', 'Modern Design', 'Premium Material'],
      colors: ['#000000', '#FF6B00', '#00FF00'],
      visualStyle: isFashionItem 
        ? 'Elegant, Fashion-forward, Professional'
        : 'Minimalist, Tech-focused, Professional',
      aiPrompt: isFashionItem
        ? 'A stylish modern fashion item with elegant design, premium fabric, professional fashion photography, studio lighting, 8k resolution, ultra detailed'
        : 'A sleek modern electronic device with minimalist design, high-tech aesthetic, premium materials, professional photography, studio lighting, 8k resolution, ultra detailed',
      negativePrompt: 'blurry, low quality, distorted, amateur, cheap, cluttered',
      confidence: 95.8,
      processingTime: '2.8s',
      models: ['Gemini Vision', 'GPT-4 Vision', 'Grok Vision'],
      isFashion: isFashionItem,
      marketingContent: {
        shopee: `🔥 DEAL SỐC - GIẢM GIÁ CỰC MẠNH! 🔥\n\n✨ ${isFashionItem ? 'Thời trang cao cấp' : 'Sản phẩm công nghệ'} chính hãng 100%\n\n✅ Chất liệu cao cấp, bền đẹp\n✅ Thiết kế hiện đại, sang trọng\n✅ Đóng gói cẩn thận, giao hàng nhanh\n✅ Bảo hành chính hãng 12 tháng\n\n💥 ƯU ĐÃI ĐẶC BIỆT HÔM NAY:\n👉 Giảm ngay 30% khi nhập mã: BGAI30\n👉 Freeship toàn quốc đơn từ 99k\n👉 Tặng quà tri ân cho 100 khách đầu tiên\n\n⏰ SỐ LƯỢNG CÓ HẠN - ĐẶT NGAY KẺO HẾT! ⏰\n\n📱 INBOX NGAY ĐỂ ĐƯỢC TƯ VẤN TẬN TÌNH!\n🛒 THÊM VÀO GIỎ HÀNG NGAY!`,
        facebook: `Hôm qua mình đi shopping thấy ${isFashionItem ? 'món đồ này' : 'sản phẩm này'} mà mê quá! 😍\n\nBan đầu cứ nghĩ giá chắc cao lắm, ai ngờ mở app lại thấy đang sale cực mạnh luôn á! ${isFashionItem ? 'Chất liệu xịn, mặc vào vừa vặn' : 'Thiết kế đẹp mắt, dùng siêu mượt'} y như mơ ước của mình luôn 💕\n\nGiờ mình đang dùng thấy quá ưng ý! ${isFashionItem ? 'Vải mềm mại, form dáng chuẩn' : 'Tính năng đầy đủ, hiệu suất cao'}, ai nhìn cũng khen! Thích nhất là ${isFashionItem ? 'màu sắc sang trọng' : 'thiết kế tinh tế'}, mix match với gì cũng ok hết 🌟\n\nAi đang tìm ${isFashionItem ? 'outfit đẹp' : 'món đồ xịn'} thì nên sắm ngay nha! Deal này không biết còn lâu không nữa 🔥\n\n💬 Comment bên dưới nếu bạn thích nhé!\n👉 Tag hội chị em để cùng sắm đồ nào!\n💝 Share để lưu lại, đừng để lỡ deal này!`,
        instagram: `Less is more. ✨\n\n${isFashionItem ? 'Style không cần la liếng, chỉ cần đúng điệu.' : 'Cuộc sống đơn giản hơn với công nghệ thông minh.'}\n\nKhi bạn tìm thấy thứ hoàn hảo, mọi thứ khác đều trở nên thừa. ${isFashionItem ? 'Một thiết kế tinh tế, một phong cách riêng biệt.' : 'Một sản phẩm chất lượng, một trải nghiệm khác biệt.'}\n\nKhông cần nhiều, chỉ cần đủ. 💫\n\n#Minimalist #LessIsMore #Style #Quality #Aesthetic #Luxury ${isFashionItem ? '#Fashion #OOTD' : '#Tech #Innovation'}`
      }
    }

    setAnalysisResult(mockResult)
    setShowFashionForm(isFashionItem)
    setMarketingContent(mockResult.marketingContent)
    setIsAnalyzing(false)
  }

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  // Translation dictionary
  const translations: Record<string, string> = {
    'High Resolution': 'Độ Phân Giải Cao',
    'Modern Design': 'Thiết Kế Hiện Đại',
    'Premium Material': 'Chất Liệu Cao Cấp',
    'Professional': 'Chuyên Nghiệp',
    'Minimalist': 'Tối Giản',
    'Elegant': 'Sang Trọng',
    'Casual': 'Năng Động',
    'Luxury': 'Cao Cấp',
    'Vintage': 'Cổ Điển',
    'Electronics Device': 'Thiết Bị Điện Tử',
    'Fashion Item': 'Thời Trang',
    'Clothing': 'Quần Áo',
    'Accessories': 'Phụ Kiện',
    'Footwear': 'Giày Dép'
  }

  const translateToVietnamese = (text: string): string => {
    return translations[text] || text
  }

  // Generate Fashion Model Prompt
  const generateFashionPrompt = (productDesc: string, options: typeof fashionOptions) => {
    const genderMap: Record<string, {en: string, vi: string}> = {
      male: { en: 'male', vi: 'nam' },
      female: { en: 'female', vi: 'nữ' },
      unisex: { en: 'unisex', vi: 'unisex' }
    }

    const ethnicityMap: Record<string, {en: string, vi: string}> = {
      vietnam: { en: 'Vietnamese', vi: 'Việt Nam' },
      korea: { en: 'Korean', vi: 'Hàn Quốc' },
      western: { en: 'Caucasian', vi: 'Âu Mỹ' },
      latin: { en: 'Latin', vi: 'Latin' }
    }

    const ageMap: Record<string, {en: string, vi: string}> = {
      genz: { en: '22 year old', vi: '22 tuổi' },
      adult: { en: '28 year old', vi: '28 tuổi' },
      middle: { en: '35 year old', vi: '35 tuổi' }
    }

    const backgroundMap: Record<string, {en: string, vi: string}> = {
      studio: { en: 'white studio background', vi: 'studio phông trắng' },
      saigon: { en: 'urban street in Saigon Vietnam', vi: 'đường phố Sài Gòn' },
      cafe: { en: 'luxury cafe interior', vi: 'quán cafe sang trọng' },
      cyberpunk: { en: 'cyberpunk neon studio', vi: 'studio phong cách cyberpunk' }
    }

    const shotMap: Record<string, {en: string, vi: string}> = {
      full: { en: 'Full body shot', vi: 'Ảnh chụp toàn thân' },
      portrait: { en: 'Portrait shot', vi: 'Ảnh chân dung' }
    }

    const gender = genderMap[options.gender]
    const ethnicity = ethnicityMap[options.ethnicity]
    const age = ageMap[options.ageGroup]
    const background = backgroundMap[options.background]
    const shot = shotMap[options.shotType]

    const promptEN = `${shot.en} of a ${age.en} ${ethnicity.en} ${gender.en} model wearing ${productDesc}, posing in ${background.en}, professional photography, studio lighting, fashion editorial, 8k resolution, photorealistic, high fashion, detailed texture`

    const promptVI = `${shot.vi} của người mẫu ${gender.vi} ${ethnicity.vi} ${age.vi} mặc ${productDesc}, chụp tại ${background.vi}, nhiếp ảnh chuyên nghiệp, ánh sáng studio, phong cách thời trang cao cấp, độ phân giải 8k, ảnh thực tế, chi tiết sắc nét`

    return { en: promptEN, vi: promptVI }
  }

  // Handle Fashion Form Submit
  const handleFashionGenerate = () => {
    const productDesc = analysisResult?.productType || 'fashion item'
    const prompt = generateFashionPrompt(productDesc, fashionOptions)
    setFashionPrompt(prompt)
  }

  // Handle Generate Model Image with Flux
  const handleGenerateModelImage = async () => {
    if (!analysisResult?.aiPrompt) return

    setIsGeneratingModel(true)
    setGeneratedModelImage('')

    try {
      const response = await fetch('/api/generate-model', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: analysisResult.aiPrompt
        })
      })

      const data = await response.json()

      if (data.success) {
        setGeneratedModelImage(data.imageUrl)
      } else {
        alert(`Lỗi: ${data.error}`)
      }
    } catch (error: any) {
      alert(`Lỗi kết nối: ${error.message}`)
    } finally {
      setIsGeneratingModel(false)
    }
  }

  // Download generated image
  const downloadImage = (url: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = `bg-ai-model-${Date.now()}.webp`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Boot Sequence Screen
  if (!bootComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-2xl"
        >
          <div className="text-center mb-8">
            <motion.h1
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-6xl font-bold mb-4 glow-text"
            >
              BG AI TOOLS
            </motion.h1>
            <p className="text-cyber-secondary text-xl">
              ĐANG KHỚI ĐỘNG...
            </p>
          </div>

          {/* Progress Bar */}
          <div className="relative h-4 border border-cyber-primary glow-border mb-6">
            <motion.div
              className="absolute inset-0 bg-cyber-primary"
              initial={{ width: 0 }}
              animate={{ width: `${bootProgress}%` }}
              transition={{ duration: 0.3 }}
              style={{
                boxShadow: '0 0 20px rgba(0, 255, 0, 0.8)',
              }}
            />
          </div>

          {/* Boot Messages */}
          <div className="space-y-2 font-mono text-sm">
            {[
              '[HỆ THỐNG] Đang khởi tạo lõi hệ thống BG Ai...',
              '[BẢO MẬT] Đang bỏ qua các giao thức bảo mật...',
              '[MẠNG] Đang kết nối mạng nơ-ron đa chiều...',
              '[DỮ LIỆU] Tải dữ liệu máy chủ thành công.',
              '[TRẠNG THÁI] QUYỀN TRUY CẬP ĐƯỢC CHẤP NHẬN.',
            ].map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: bootProgress > i * 20 ? 1 : 0.3,
                  x: bootProgress > i * 20 ? 0 : -20
                }}
                transition={{ delay: i * 0.6 }}
                className="flex items-center gap-2"
              >
                {bootProgress > i * 20 ? (
                  <Check className="w-4 h-4 text-cyber-primary" />
                ) : (
                  <Loader2 className="w-4 h-4 animate-spin text-cyber-secondary" />
                )}
                <span className={bootProgress > i * 20 ? 'text-cyber-primary' : 'text-cyber-secondary'}>
                  {msg}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Progress Percentage */}
          <motion.div
            className="text-center mt-8 text-4xl font-bold text-cyber-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {bootProgress}%
          </motion.div>
        </motion.div>
      </div>
    )
  }

  // Main Dashboard
  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="border border-cyber-primary p-6 glow-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Terminal className="w-12 h-12 text-cyber-primary" />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold glow-text">
                  &gt;_ BG AI TOOLS_
                </h1>
                <p className="text-cyber-secondary text-sm">
                  CÔNG CỤ AI ĐA NỀN TẢNG v2.0.1
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-xs text-cyber-secondary">TRẠNG THÁI HỆ THỐNG</div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyber-primary rounded-full animate-pulse" />
                  <span className="text-cyber-primary font-bold">ONLINE</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-cyber-secondary">ĐỊA CHỈ IP</div>
                <div className="text-cyber-primary font-mono text-sm">
                  192.168.0.42
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Cpu, label: 'TẢI CPU', value: '34%', color: 'text-cyber-primary' },
          { icon: Activity, label: 'MÔ HÌNH AI', value: '3/3', color: 'text-cyber-secondary' },
          { icon: Zap, label: 'UPTIME', value: '99.9%', color: 'text-cyber-accent' },
          { icon: Shield, label: 'BẢO MẬT', value: 'HOẠT ĐỘNG', color: 'text-cyber-warning' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="border border-cyber-primary p-4 glow-border hover:shadow-glow-green transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-cyber-secondary mb-1">
                  {stat.label}
                </div>
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <div className="border border-cyber-primary p-6 glow-border">
            <div className="flex items-center gap-3 mb-6">
              <Terminal className="w-6 h-6 text-cyber-primary" />
              <h2 className="text-2xl font-bold text-cyber-primary">
                DÒNG LỆNH TẢI ẢNH
              </h2>
            </div>

            {/* Upload Area */}
            <div
              className={`relative border-2 border-dashed p-8 transition-all ${
                isDragging
                  ? 'border-cyber-secondary bg-cyber-secondary bg-opacity-10'
                  : 'border-cyber-primary'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="file-upload"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
              />

              {!previewUrl ? (
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload className="w-16 h-16 text-cyber-primary mb-4" />
                  <p className="text-cyber-primary text-lg font-bold mb-2">
                    THẢ ẢNH VÀO ĐÂY
                  </p>
                  <p className="text-cyber-secondary text-sm">
                    hoặc nhấp để chọn tệp
                  </p>
                  <p className="text-cyber-secondary text-xs mt-2">
                    Hỗ trợ: JPG, PNG, WebP (tối đa 10MB)
                  </p>
                </label>
              ) : (
                <div className="space-y-4">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-64 object-contain border border-cyber-primary"
                  />
                  <div className="flex gap-4">
                    <button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="flex-1 cyber-button"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-5 h-5 inline mr-2 animate-spin" />
                          ĐANG PHÂN TÍCH...
                        </>
                      ) : (
                        <>
                          <Brain className="w-5 h-5 inline mr-2" />
                          PHÂN TÍCH NGAY
                        </>
                      )}
                    </button>
                    <label
                      htmlFor="file-upload"
                      className="cyber-button cursor-pointer"
                    >
                      ĐỔI ẢNH
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Analysis Results */}
            <AnimatePresence>
              {analysisResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-6 space-y-4"
                >
                  {/* Product Info */}
                  <div className="border border-cyber-secondary p-4 glow-border-cyan">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-cyber-secondary">
                        PHÂN TÍCH HOÀN TẤT
                      </h3>
                      <div className="flex items-center gap-2">
                        <Eye className="w-5 h-5 text-cyber-secondary" />
                        <span className="text-cyber-secondary">
                          {analysisResult.confidence}% confidence
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-cyber-secondary text-sm">
                          LOẠI SẢN PHẨM:
                        </span>
                        <p className="text-cyber-primary font-bold">
                          {translateToVietnamese(analysisResult.productType)}
                        </p>
                      </div>

                      <div>
                        <span className="text-cyber-secondary text-sm">
                          ĐẶC ĐIỂM NỔI BẬT:
                        </span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {analysisResult.keyFeatures.map((feature: string, i: number) => (
                            <span
                              key={i}
                              className="px-3 py-1 border border-cyber-primary text-cyber-primary text-sm"
                            >
                              {translateToVietnamese(feature)}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-cyber-secondary text-sm">
                          PHONG CÁCH THIẾT KẾ:
                        </span>
                        <p className="text-cyber-primary">
                          {analysisResult.visualStyle}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* AI Prompt */}
                  <div className="border border-cyber-accent p-4 glow-border">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-bold text-cyber-accent">
                        PROMPT AI TỐI ƯU
                      </h4>
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2 text-xs text-cyber-accent cursor-pointer">
                          <input
                            type="checkbox"
                            checked={showVietnamese}
                            onChange={(e) => setShowVietnamese(e.target.checked)}
                            className="w-4 h-4 bg-transparent border-2 border-cyber-accent appearance-none checked:bg-cyber-accent cursor-pointer"
                          />
                          Dịch sang Tiếng Việt
                        </label>
                        <button
                          onClick={() => copyToClipboard(analysisResult.aiPrompt)}
                          className="p-2 border border-cyber-accent text-cyber-accent hover:bg-cyber-accent hover:text-black transition-all"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-cyber-primary text-sm font-mono">
                      {analysisResult.aiPrompt}
                    </p>
                  </div>

                  {/* Negative Prompt */}
                  <div className="border border-cyber-danger p-4 glow-border">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-bold text-cyber-danger">
                        PROMPT PHỦ ĐỊNH
                      </h4>
                      <button
                        onClick={() => copyToClipboard(analysisResult.negativePrompt)}
                        className="p-2 border border-cyber-danger text-cyber-danger hover:bg-cyber-danger hover:text-black transition-all"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-cyber-danger text-sm font-mono">
                      {analysisResult.negativePrompt}
                    </p>
                  </div>

                  {/* Flux Model Generator */}
                  <div className="border border-cyber-primary p-6 glow-border mt-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Sparkles className="w-6 h-6 text-cyber-primary" />
                      <h3 className="text-xl font-bold text-cyber-primary">
                        TẠO ẢNH NGƯỜI MẪU AI (FLUX.1)
                      </h3>
                    </div>

                    <button
                      onClick={handleGenerateModelImage}
                      disabled={isGeneratingModel}
                      className="w-full cyber-button mb-4"
                    >
                      {isGeneratingModel ? (
                        <>
                          <Loader2 className="w-5 h-5 inline mr-2 animate-spin" />
                          ĐANG TẠO ẢNH... (30-60s)
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 inline mr-2" />
                          ⚡ TẠO ẢNH NGƯỜI MẪU (FLUX)
                        </>
                      )}
                    </button>

                    {generatedModelImage && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <div className="relative border border-cyber-primary glow-border">
                          <img
                            src={generatedModelImage}
                            alt="Generated Model"
                            className="w-full h-auto"
                          />
                        </div>
                        <button
                          onClick={() => downloadImage(generatedModelImage)}
                          className="w-full cyber-button"
                        >
                          <Download className="w-5 h-5 inline mr-2" />
                          DOWNLOAD HD
                        </button>
                      </motion.div>
                    )}
                  </div>

                  {/* Fashion Model Generator Form */}
                  {showFashionForm && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-cyber-warning p-6 glow-border mt-4"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <User className="w-6 h-6 text-cyber-warning" />
                        <h3 className="text-xl font-bold text-cyber-warning">
                          TẠO NGƯỜI MẪU AI
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Gender */}
                        <div>
                          <label className="block text-cyber-secondary text-sm mb-2">
                            GIỚI TÍNH:
                          </label>
                          <select
                            value={fashionOptions.gender}
                            onChange={(e) => setFashionOptions({...fashionOptions, gender: e.target.value})}
                            className="w-full bg-black border border-cyber-primary text-cyber-primary p-2 font-mono"
                          >
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                            <option value="unisex">Unisex</option>
                          </select>
                        </div>

                        {/* Ethnicity */}
                        <div>
                          <label className="block text-cyber-secondary text-sm mb-2">
                            QUỐC GIA/SẮC TỘC:
                          </label>
                          <select
                            value={fashionOptions.ethnicity}
                            onChange={(e) => setFashionOptions({...fashionOptions, ethnicity: e.target.value})}
                            className="w-full bg-black border border-cyber-primary text-cyber-primary p-2 font-mono"
                          >
                            <option value="vietnam">Việt Nam</option>
                            <option value="korea">Hàn Quốc</option>
                            <option value="western">Âu Mỹ</option>
                            <option value="latin">Latin</option>
                          </select>
                        </div>

                        {/* Age Group */}
                        <div>
                          <label className="block text-cyber-secondary text-sm mb-2">
                            ĐỘ TUỔI:
                          </label>
                          <select
                            value={fashionOptions.ageGroup}
                            onChange={(e) => setFashionOptions({...fashionOptions, ageGroup: e.target.value})}
                            className="w-full bg-black border border-cyber-primary text-cyber-primary p-2 font-mono"
                          >
                            <option value="genz">Gen Z (18-24)</option>
                            <option value="adult">Trưởng thành (25-35)</option>
                            <option value="middle">Trung niên (36-45)</option>
                          </select>
                        </div>

                        {/* Background */}
                        <div>
                          <label className="block text-cyber-secondary text-sm mb-2">
                            BỐI CẢNH:
                          </label>
                          <select
                            value={fashionOptions.background}
                            onChange={(e) => setFashionOptions({...fashionOptions, background: e.target.value})}
                            className="w-full bg-black border border-cyber-primary text-cyber-primary p-2 font-mono"
                          >
                            <option value="studio">Studio Phông Trắng</option>
                            <option value="saigon">Đường Phố Sài Gòn</option>
                            <option value="cafe">Cafe Sang Trọng</option>
                            <option value="cyberpunk">Studio Cyberpunk</option>
                          </select>
                        </div>

                        {/* Shot Type */}
                        <div className="md:col-span-2">
                          <label className="block text-cyber-secondary text-sm mb-2">
                            GÓC CHỤP:
                          </label>
                          <select
                            value={fashionOptions.shotType}
                            onChange={(e) => setFashionOptions({...fashionOptions, shotType: e.target.value})}
                            className="w-full bg-black border border-cyber-primary text-cyber-primary p-2 font-mono"
                          >
                            <option value="full">Toàn thân</option>
                            <option value="portrait">Chân dung (Nửa người)</option>
                          </select>
                        </div>
                      </div>

                      <button
                        onClick={handleFashionGenerate}
                        className="w-full cyber-button mb-4"
                      >
                        <Camera className="w-5 h-5 inline mr-2" />
                        TẠO PROMPT NGƯỜI MẪU
                      </button>

                      {/* Generated Fashion Prompt */}
                      {fashionPrompt.en && (
                        <div className="space-y-3">
                          <div className="border border-cyber-accent p-4 glow-border">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-bold text-cyber-accent">
                                PROMPT NGƯỜI MẪU (TIẾNG ANH)
                              </h4>
                              <button
                                onClick={() => copyToClipboard(fashionPrompt.en)}
                                className="p-2 border border-cyber-accent text-cyber-accent hover:bg-cyber-accent hover:text-black transition-all"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-cyber-accent text-xs font-mono">
                              {fashionPrompt.en}
                            </p>
                          </div>

                          <div className="border border-cyber-secondary p-4 glow-border-cyan">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-bold text-cyber-secondary">
                                BẢN DỊCH TIẾNG VIỆT (Tham khảo)
                              </h4>
                            </div>
                            <p className="text-cyber-secondary text-xs font-mono">
                              {fashionPrompt.vi}
                            </p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Marketing Content Section */}
                  {marketingContent && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-cyber-warning p-6 glow-border mt-4"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <Megaphone className="w-6 h-6 text-cyber-warning" />
                        <h3 className="text-2xl font-bold text-cyber-warning">
                          NỘI DUNG QUẢNG CÁO
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Shopee/E-commerce Style */}
                        <div className="border border-cyber-primary p-4 glow-border">
                          <div className="flex items-center gap-2 mb-3">
                            <ShoppingBag className="w-5 h-5 text-cyber-primary" />
                            <h4 className="text-sm font-bold text-cyber-primary">
                              SHOPEE / E-COMMERCE
                            </h4>
                          </div>
                          <div className="relative">
                            <p className="text-cyber-primary text-xs font-mono whitespace-pre-line h-64 overflow-y-auto">
                              {marketingContent.shopee}
                            </p>
                            <button
                              onClick={() => copyToClipboard(marketingContent.shopee)}
                              className="absolute top-2 right-2 p-2 border border-cyber-primary text-cyber-primary hover:bg-cyber-primary hover:text-black transition-all"
                              title="Copy Shopee Content"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Facebook/TikTok Style */}
                        <div className="border border-cyber-secondary p-4 glow-border-cyan">
                          <div className="flex items-center gap-2 mb-3">
                            <MessageCircle className="w-5 h-5 text-cyber-secondary" />
                            <h4 className="text-sm font-bold text-cyber-secondary">
                              FACEBOOK / TIKTOK
                            </h4>
                          </div>
                          <div className="relative">
                            <p className="text-cyber-secondary text-xs font-mono whitespace-pre-line h-64 overflow-y-auto">
                              {marketingContent.facebook}
                            </p>
                            <button
                              onClick={() => copyToClipboard(marketingContent.facebook)}
                              className="absolute top-2 right-2 p-2 border border-cyber-secondary text-cyber-secondary hover:bg-cyber-secondary hover:text-black transition-all"
                              title="Copy Facebook Content"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Instagram/Luxury Style */}
                        <div className="border border-cyber-accent p-4 glow-border">
                          <div className="flex items-center gap-2 mb-3">
                            <Instagram className="w-5 h-5 text-cyber-accent" />
                            <h4 className="text-sm font-bold text-cyber-accent">
                              INSTAGRAM / LUXURY
                            </h4>
                          </div>
                          <div className="relative">
                            <p className="text-cyber-accent text-xs font-mono whitespace-pre-line h-64 overflow-y-auto">
                              {marketingContent.instagram}
                            </p>
                            <button
                              onClick={() => copyToClipboard(marketingContent.instagram)}
                              className="absolute top-2 right-2 p-2 border border-cyber-accent text-cyber-accent hover:bg-cyber-accent hover:text-black transition-all"
                              title="Copy Instagram Content"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 text-xs text-cyber-secondary text-center">
                        💡 Tip: Click nút Copy để sao chép nội dung và sử dụng trên các nền tảng tương ứng
                      </div>
                    </motion.div>
                  )}

                  {/* Processing Info */}
                  <div className="flex items-center justify-between text-sm text-cyber-secondary">
                    <span>Thời gian xử lý: {analysisResult.processingTime}</span>
                    <span>Mô hình sử dụng: {analysisResult.models.join(', ')}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* System Status Panel */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {/* AI Models Status */}
          <div className="border border-cyber-primary p-6 glow-border">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-6 h-6 text-cyber-primary" />
              <h3 className="text-xl font-bold text-cyber-primary">
                CÁC MÔ HÌNH AI
              </h3>
            </div>

            <div className="space-y-3">
              {[
                { name: 'Gemini Vision', status: 'HOẠT ĐỘNG', load: 78 },
                { name: 'GPT-4 Vision', status: 'HOẠT ĐỘNG', load: 65 },
                { name: 'Grok Vision', status: 'HOẠT ĐỘNG', load: 82 },
              ].map((model, i) => (
                <div
                  key={i}
                  className="border border-cyber-secondary p-3 hover:shadow-glow-cyan transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-cyber-primary font-bold text-sm">
                      {model.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-cyber-secondary rounded-full animate-pulse" />
                      <span className="text-cyber-secondary text-xs">
                        {model.status}
                      </span>
                    </div>
                  </div>
                  <div className="relative h-2 bg-black border border-cyber-secondary">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-cyber-secondary"
                      initial={{ width: 0 }}
                      animate={{ width: `${model.load}%` }}
                      transition={{ duration: 1, delay: i * 0.2 }}
                    />
                  </div>
                  <div className="text-right text-cyber-secondary text-xs mt-1">
                    {model.load}% công suất
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Logs */}
          <div className="border border-cyber-warning p-6 glow-border">
            <div className="flex items-center gap-3 mb-4">
              <Server className="w-6 h-6 text-cyber-warning" />
              <h3 className="text-xl font-bold text-cyber-warning">
                NHẬT KÝ HỆ THỐNG
              </h3>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {[
                '[17:32:15] Mạng nơ-ron đã khởi tạo',
                '[17:32:16] Kết nối thành công',
                '[17:32:17] Tất cả hệ thống đang hoạt động',
                '[17:32:18] Sẵn sàng phân tích',
                '[17:32:19] Đang chờ dữ liệu...',
              ].map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-2 text-cyber-warning"
                >
                  <ChevronRight className="w-3 h-3" />
                  <span>{log}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border border-cyber-accent p-6 glow-border">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-cyber-accent" />
              <h3 className="text-xl font-bold text-cyber-accent">
                HÀNH ĐỘNG NHANH
              </h3>
            </div>

            <div className="space-y-2">
              {[
                { icon: Database, label: 'Xem Cơ Sở Dữ Liệu', color: 'border-cyber-primary text-cyber-primary' },
                { icon: Shield, label: 'Quét Bảo Mật', color: 'border-cyber-secondary text-cyber-secondary' },
                { icon: Activity, label: 'Giám Sát Hệ Thống', color: 'border-cyber-accent text-cyber-accent' },
              ].map((action, i) => (
                <button
                  key={i}
                  className={`w-full flex items-center gap-3 p-3 border ${action.color} hover:bg-opacity-10 transition-all`}
                >
                  <action.icon className="w-5 h-5" />
                  <span className="font-bold text-sm">{action.label}</span>
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 text-center text-cyber-secondary text-sm"
      >
        <div className="border-t border-cyber-primary pt-4">
          <p>BG AI TOOLS © 2025 | ĐIỀU KHIỂN BỚI TRÍ TUỆ NHÂN TẠO | TẤT CẢ HỆ THỐNG ĐANG HOẠT ĐỘNG</p>
        </div>
      </motion.footer>
    </div>
  )
}
