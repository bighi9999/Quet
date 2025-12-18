'use client';

import { Video, Upload, Sparkles } from 'lucide-react';

export default function VideoGeneratorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black text-white pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl mb-6 animate-pulse">
          <Video className="w-10 h-10" />
        </div>

        {/* Title */}
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-600 mb-4">
          🎥 Tạo Video AI
        </h1>

        {/* Status Badge */}
        <div className="inline-flex items-center space-x-2 bg-cyan-500/20 border border-cyan-500/50 px-4 py-2 rounded-full mb-6">
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
          <span className="text-cyan-400 font-medium">Module đang sẵn sàng kết nối AI Model</span>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
          Tạo video tự động từ kịch bản, hình ảnh sản phẩm và giọng đọc AI. 
          Module đang trong giai đoạn kết nối với các mô hình AI tiên tiến.
        </p>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-black/40 backdrop-blur-lg border border-cyan-800/50 rounded-xl p-6">
            <Sparkles className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">AI Script to Video</h3>
            <p className="text-sm text-gray-400">
              Chuyển đổi kịch bản thành video hoàn chỉnh tự động
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-lg border border-blue-800/50 rounded-xl p-6">
            <Upload className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">Product Integration</h3>
            <p className="text-sm text-gray-400">
              Tích hợp hình ảnh sản phẩm vào video marketing
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-lg border border-purple-800/50 rounded-xl p-6">
            <Video className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">Voice Overlay</h3>
            <p className="text-sm text-gray-400">
              Thêm giọng đọc TTS tự động vào video
            </p>
          </div>
        </div>

        {/* Coming Soon Banner */}
        <div className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 border border-cyan-500/30 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-3">🚀 Sắp Ra Mắt</h2>
          <p className="text-gray-300 mb-6">
            Chúng tôi đang tích hợp các mô hình AI video generation tiên tiến như:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['RunwayML Gen-2', 'Pika Labs', 'Stable Video Diffusion', 'Google Veo'].map((model) => (
              <span 
                key={model}
                className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400 text-sm font-medium"
              >
                {model}
              </span>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <a
            href="/tools"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-gray-700 rounded-lg text-gray-300 transition-all duration-300"
          >
            <span>← Quay lại Công cụ</span>
          </a>
        </div>
      </div>
    </div>
  );
}
