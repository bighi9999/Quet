'use client';

import Link from 'next/link';
import { Image, Video, Mic, Sparkles, Wand2, Upload } from 'lucide-react';

const TOOLS = [
  {
    id: 'image-generator',
    name: 'Tạo Ảnh AI',
    description: 'Sử dụng Google Imagen 3 để tạo ảnh chất lượng cao từ mô tả văn bản',
    icon: <Image className="w-8 h-8" />,
    href: '/tools/image-generator',
    status: 'ready',
    color: 'from-pink-500 to-purple-600'
  },
  {
    id: 'video-generator',
    name: 'Tạo Video AI',
    description: 'Module tạo video tự động từ kịch bản và hình ảnh sản phẩm',
    icon: <Video className="w-8 h-8" />,
    href: '/tools/video-generator',
    status: 'ready',
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'voice-tts',
    name: 'Giọng Đọc TTS',
    description: 'Google Cloud Text-to-Speech với 5 giọng đọc tiếng Việt chuyên nghiệp',
    icon: <Mic className="w-8 h-8" />,
    href: '/google-cloud',
    status: 'online',
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'ai-upscaler',
    name: 'Làm Nét 4K',
    description: 'Upscale ảnh lên 2x-4x với HuggingFace Real-ESRGAN',
    icon: <Sparkles className="w-8 h-8" />,
    href: '/tools/upscaler',
    status: 'ready',
    color: 'from-yellow-500 to-orange-600'
  },
  {
    id: 'reverse-prompt',
    name: 'Lấy Prompt từ Ảnh',
    description: 'Phân tích ảnh và tạo prompt mô tả bằng AI Vision',
    icon: <Wand2 className="w-8 h-8" />,
    href: '/tools/reverse-prompt',
    status: 'ready',
    color: 'from-purple-500 to-pink-600'
  },
  {
    id: 'inpainting',
    name: 'Magic Brush',
    description: 'Chỉnh sửa ảnh bằng AI với công cụ vẽ và masking',
    icon: <Upload className="w-8 h-8" />,
    href: '/tools/inpainting',
    status: 'ready',
    color: 'from-indigo-500 to-purple-600'
  }
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600 mb-4">
            🛠️ Công Cụ AI
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Bộ công cụ AI đa năng cho sáng tạo nội dung, tối ưu hình ảnh và xử lý đa phương tiện
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOOLS.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="group relative bg-black/40 backdrop-blur-lg border border-purple-800/50 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-1"
            >
              {/* Icon Background */}
              <div className={`w-16 h-16 bg-gradient-to-br ${tool.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {tool.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                {tool.name}
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                {tool.description}
              </p>

              {/* Status Badge */}
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${tool.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`}></div>
                <span className={`text-xs font-medium ${tool.status === 'online' ? 'text-green-400' : 'text-yellow-400'}`}>
                  {tool.status === 'online' ? 'Đang hoạt động' : 'Sẵn sàng'}
                </span>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/0 via-cyan-500/0 to-purple-500/0 group-hover:from-cyan-500/20 group-hover:via-purple-500/20 group-hover:to-cyan-500/20 transition-all duration-500 pointer-events-none"></div>
            </Link>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-gradient-to-r from-cyan-900/20 to-purple-900/20 border border-cyan-500/30 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">💡 Hướng Dẫn Sử Dụng</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-300">
            <div>
              <h3 className="font-semibold text-cyan-400 mb-2">🎨 Tạo Ảnh & Video</h3>
              <p className="text-sm">Sử dụng Google Imagen 3 và các mô hình AI tiên tiến để tạo hình ảnh và video chất lượng cao từ văn bản mô tả.</p>
            </div>
            <div>
              <h3 className="font-semibold text-purple-400 mb-2">🔊 Giọng Đọc AI</h3>
              <p className="text-sm">Google Cloud TTS với 5 giọng đọc tiếng Việt tự nhiên, điều chỉnh tốc độ và cao độ linh hoạt.</p>
            </div>
            <div>
              <h3 className="font-semibold text-pink-400 mb-2">✨ Tối Ưu Hình Ảnh</h3>
              <p className="text-sm">Upscale ảnh lên độ phân giải 4K, làm nét, và phục hồi chi tiết bằng Real-ESRGAN và SwinIR.</p>
            </div>
            <div>
              <h3 className="font-semibold text-yellow-400 mb-2">🪄 Công Cụ Nâng Cao</h3>
              <p className="text-sm">Reverse prompt engineering, Magic Brush inpainting, và xuất project ZIP hoàn chỉnh.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
