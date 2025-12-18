'use client';

import { useState } from 'react';
import { Mic, Play, Square, Download, Volume2, Loader2 } from 'lucide-react';

export default function TTSPage() {
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleGenerate = async () => {
    if (!text.trim()) return;
    
    setIsGenerating(true);
    // Simulate API call (replace with actual API)
    setTimeout(() => {
      setIsGenerating(false);
      // Mock audio URL
      setAudioUrl('#');
    }, 2000);
  };

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl mb-4">
            <Mic className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Text-to-Speech
            </span>
          </h1>
          <p className="text-gray-400">
            Chuyển đổi văn bản thành giọng nói tự nhiên với Google Cloud TTS
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-8 space-y-6">
          {/* Text Input */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-white uppercase tracking-wider">
              Nhập văn bản
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Nhập văn bản bạn muốn chuyển đổi thành giọng nói..."
              className="w-full h-48 bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all resize-none"
              maxLength={5000}
            />
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span>{text.length} / 5000 ký tự</span>
              {text.length > 0 && (
                <button
                  onClick={() => setText('')}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  Xóa văn bản
                </button>
              )}
            </div>
          </div>

          {/* Voice Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Giọng đọc</label>
              <select className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30">
                <option>Tiếng Việt - Nữ (vi-VN-Wavenet-A)</option>
                <option>Tiếng Việt - Nam (vi-VN-Wavenet-B)</option>
                <option>English - Female (en-US-Wavenet-F)</option>
                <option>English - Male (en-US-Wavenet-D)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Tốc độ</label>
              <select className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30">
                <option>Bình thường (1.0x)</option>
                <option>Chậm (0.75x)</option>
                <option>Nhanh (1.25x)</option>
                <option>Rất nhanh (1.5x)</option>
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!text.trim() || isGenerating}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/30"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Đang tạo giọng đọc...</span>
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5" />
                <span>Tạo giọng đọc</span>
              </>
            )}
          </button>

          {/* Audio Player */}
          {audioUrl && (
            <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-lg p-6 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Kết quả
              </h3>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-cyan-500/50"
                >
                  {isPlaying ? (
                    <Square className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white ml-1" />
                  )}
                </button>

                <div className="flex-1">
                  <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 w-0 transition-all duration-300"></div>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                    <span>0:00</span>
                    <span>0:00</span>
                  </div>
                </div>

                <button className="p-3 bg-white/5 hover:bg-white/10 border border-cyan-500/30 rounded-lg transition-all group">
                  <Download className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300" />
                </button>
              </div>
            </div>
          )}

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            {[
              { icon: '🎤', title: 'Giọng tự nhiên', desc: 'Công nghệ WaveNet AI' },
              { icon: '🌍', title: 'Đa ngôn ngữ', desc: 'Hỗ trợ 40+ ngôn ngữ' },
              { icon: '⚡', title: 'Nhanh chóng', desc: 'Tạo trong vài giây' }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white/5 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">{feature.icon}</div>
                <div className="text-sm font-bold text-white mb-1">{feature.title}</div>
                <div className="text-xs text-gray-400">{feature.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
          <p className="text-sm text-cyan-400">
            💡 <span className="font-bold">Lưu ý:</span> Dịch vụ này sử dụng Google Cloud Text-to-Speech API. 
            Vui lòng đảm bảo API key đã được cấu hình trong file <code className="bg-black/50 px-2 py-1 rounded">.env.local</code>
          </p>
        </div>
      </div>
    </div>
  );
}
