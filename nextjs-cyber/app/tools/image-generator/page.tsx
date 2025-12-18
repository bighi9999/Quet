'use client';

import { useState } from 'react';
import { Sparkles, Image as ImageIcon, Download } from 'lucide-react';

export default function ImageGeneratorPage() {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGeneratedImage('');

    try {
      const response = await fetch('/api/generate-model', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, aspectRatio })
      });

      const data = await response.json();

      if (data.image) {
        setGeneratedImage(data.image);
      } else {
        alert('Lỗi: ' + (data.error || 'Không thể tạo ảnh'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Lỗi kết nối API');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl mb-4">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-600 mb-2">
            🎨 Tạo Ảnh AI - Google Imagen 3
          </h1>
          <p className="text-gray-400">
            Tạo hình ảnh chất lượng cao từ mô tả văn bản với Google Imagen 3
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="bg-black/40 backdrop-blur-lg border border-purple-800/50 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">📝 Nhập Prompt</h2>
            
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Mô tả chi tiết về hình ảnh bạn muốn tạo... (tiếng Anh được khuyến nghị)"
              className="w-full h-40 bg-black/50 border border-purple-600/50 rounded-lg p-4 text-white resize-none focus:ring-2 focus:ring-pink-500 focus:outline-none mb-4"
            />

            <label className="block text-sm font-semibold text-cyan-400 mb-2">
              📐 Tỉ Lệ Khung Hình
            </label>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              className="w-full bg-black/50 border border-purple-600/50 rounded-lg p-3 text-white mb-6 focus:ring-2 focus:ring-pink-500 focus:outline-none"
            >
              <option value="1:1">1:1 (Square - Instagram Post)</option>
              <option value="9:16">9:16 (Portrait - Instagram Story)</option>
              <option value="16:9">16:9 (Landscape - YouTube Thumbnail)</option>
              <option value="4:3">4:3 (Classic)</option>
              <option value="3:4">3:4 (Portrait)</option>
            </select>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold py-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin" />
                  <span>Đang tạo ảnh...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>✨ Tạo Ảnh</span>
                </>
              )}
            </button>

            <div className="mt-4 p-4 bg-purple-900/30 border border-purple-700/50 rounded-lg">
              <p className="text-xs text-gray-400">
                💡 <strong>Mẹo:</strong> Imagen 3 hoạt động tốt nhất với prompt tiếng Anh chi tiết. 
                Nếu thất bại, hệ thống sẽ tự động chuyển sang Pollinations.ai.
              </p>
            </div>
          </div>

          {/* Output Panel */}
          <div className="bg-black/40 backdrop-blur-lg border border-purple-800/50 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">🖼️ Kết Quả</h2>
            
            <div className="aspect-[9/16] bg-black/50 border border-purple-600/50 rounded-lg overflow-hidden flex items-center justify-center">
              {isGenerating ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500 mx-auto mb-4"></div>
                  <p className="text-gray-400">Đang tạo hình ảnh của bạn...</p>
                </div>
              ) : generatedImage ? (
                <img 
                  src={generatedImage} 
                  alt="Generated" 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center text-gray-500">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>Hình ảnh của bạn sẽ xuất hiện ở đây</p>
                </div>
              )}
            </div>

            {generatedImage && (
              <a
                href={generatedImage}
                download="imagen-generated.png"
                className="block w-full mt-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 rounded-lg transition-all duration-300 text-center flex items-center justify-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>💾 Tải Xuống</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
