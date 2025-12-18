'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Terminal, Cpu, Server, Activity, Zap, Shield,
  Check, Loader2, ChevronRight, Brain,
  Scan, Image as ImageIcon, Video, Mic, Sparkles
} from 'lucide-react'

export default function Dashboard() {
  const [bootComplete, setBootComplete] = useState(false)
  const [bootProgress, setBootProgress] = useState(0)

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
              ĐANG KHỞI ĐỘNG...
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
                  CÔNG CỤ AI ĐA NỀN TẢNG v3.8.1
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
          { icon: Activity, label: 'MÔ HÌNH AI', value: '7/7', color: 'text-cyber-secondary' },
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

      {/* Main Tools Grid - SHORTCUT CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Product Analyzer Card */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Link href="/tools/product-analyzer">
            <div className="border border-cyber-primary p-8 glow-border hover:shadow-glow-green transition-all cursor-pointer group h-full">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Scan className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-cyber-primary group-hover:glow-text transition-all">
                      AI PHÂN TÍCH SẢN PHẨM
                    </h2>
                    <p className="text-cyber-secondary text-sm mt-1">
                      Upload ảnh → Nhận phân tích chi tiết
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-cyber-primary group-hover:translate-x-2 transition-transform duration-300" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyber-secondary rounded-full animate-pulse" />
                  <span className="text-cyber-secondary text-sm">
                    ✅ Phân tích kỹ thuật với 7 mô hình AI
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyber-secondary rounded-full animate-pulse" />
                  <span className="text-cyber-secondary text-sm">
                    ✅ Tự động tạo nội dung Marketing (Shopee/Facebook/Instagram)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyber-secondary rounded-full animate-pulse" />
                  <span className="text-cyber-secondary text-sm">
                    ✅ Kịch bản video review + AI Prompts tối ưu
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyber-secondary rounded-full animate-pulse" />
                  <span className="text-cyber-secondary text-sm">
                    ✅ Tạo ảnh người mẫu AI với Google Imagen
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-cyber-primary bg-opacity-10 border border-cyber-primary rounded-lg">
                <p className="text-cyber-primary text-sm font-bold text-center">
                  👉 NHẤN ĐỂ BẮT ĐẦU PHÂN TÍCH
                </p>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Image Generator Card */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link href="/tools/image-generator">
            <div className="border border-cyber-secondary p-8 glow-border-cyan hover:shadow-glow-cyan transition-all cursor-pointer group h-full">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <ImageIcon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-cyber-secondary group-hover:glow-text transition-all">
                      TẠO ẢNH AI
                    </h2>
                    <p className="text-cyber-secondary text-sm mt-1">
                      Google Imagen 3 - Chất lượng cao
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-cyber-secondary group-hover:translate-x-2 transition-transform duration-300" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyber-accent rounded-full animate-pulse" />
                  <span className="text-cyber-secondary text-sm">
                    🎨 Tạo ảnh từ mô tả văn bản
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyber-accent rounded-full animate-pulse" />
                  <span className="text-cyber-secondary text-sm">
                    🖼️ Đa dạng phong cách: Thực tế, Anime, Art
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyber-accent rounded-full animate-pulse" />
                  <span className="text-cyber-secondary text-sm">
                    ⚡ Tốc độ cao - Chất lượng 4K
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-cyber-secondary bg-opacity-10 border border-cyber-secondary rounded-lg">
                <p className="text-cyber-secondary text-sm font-bold text-center">
                  🎨 NHẤN ĐỂ TẠO ẢNH
                </p>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Video Generator Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link href="/tools/video-generator">
            <div className="border border-cyber-accent p-8 glow-border hover:shadow-glow-cyan transition-all cursor-pointer group h-full">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Video className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-cyber-accent group-hover:glow-text transition-all">
                      TẠO VIDEO AI
                    </h2>
                    <p className="text-cyber-secondary text-sm mt-1">
                      Biến ý tưởng thành video chuyên nghiệp
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-cyber-accent group-hover:translate-x-2 transition-transform duration-300" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyber-warning rounded-full animate-pulse" />
                  <span className="text-cyber-secondary text-sm">
                    🎬 Text-to-Video với AI
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyber-warning rounded-full animate-pulse" />
                  <span className="text-cyber-secondary text-sm">
                    🎥 Nhiều tỉ lệ: 16:9, 9:16, 1:1
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyber-warning rounded-full animate-pulse" />
                  <span className="text-cyber-secondary text-sm">
                    ⏱️ Video 5-30 giây
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-cyber-accent bg-opacity-10 border border-cyber-accent rounded-lg">
                <p className="text-cyber-accent text-sm font-bold text-center">
                  🎬 NHẤN ĐỂ TẠO VIDEO
                </p>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* TTS Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link href="/tools/tts">
            <div className="border border-cyber-warning p-8 glow-border hover:shadow-glow-green transition-all cursor-pointer group h-full">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Mic className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-cyber-warning group-hover:glow-text transition-all">
                      GIỌNG ĐỌC AI
                    </h2>
                    <p className="text-cyber-secondary text-sm mt-1">
                      Text-to-Speech tự nhiên
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-cyber-warning group-hover:translate-x-2 transition-transform duration-300" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-cyber-secondary text-sm">
                    🎤 Giọng Việt Nam tự nhiên
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-cyber-secondary text-sm">
                    🌍 Hỗ trợ đa ngôn ngữ
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-cyber-secondary text-sm">
                    ⚙️ Tùy chỉnh giọng & tốc độ
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-cyber-warning bg-opacity-10 border border-cyber-warning rounded-lg">
                <p className="text-cyber-warning text-sm font-bold text-center">
                  🔊 NHẤN ĐỂ TẠO GIỌNG ĐỌC
                </p>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>

      {/* System Status Panel */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
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
              { name: 'Gemini 1.5 Flash', status: 'HOẠT ĐỘNG', load: 78 },
              { name: 'Google Imagen 3', status: 'HOẠT ĐỘNG', load: 65 },
              { name: 'Qwen2-VL 7B', status: 'HOẠT ĐỘNG', load: 82 },
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
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 text-center text-cyber-secondary text-sm"
      >
        <div className="border-t border-cyber-primary pt-4">
          <p>BG AI TOOLS © 2025 | ĐIỀU KHIỂN BỞI TRÍ TUỆ NHÂN TẠO | TẤT CẢ HỆ THỐNG ĐANG HOẠT ĐỘNG</p>
        </div>
      </motion.footer>
    </div>
  )
}
