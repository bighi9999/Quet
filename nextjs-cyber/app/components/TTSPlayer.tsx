'use client';

import { useState, useRef } from 'react';
import { Volume2, Loader2, AlertCircle } from 'lucide-react';

interface TTSPlayerProps {
  text: string;
  voice?: string;
  className?: string;
  buttonText?: string;
}

export default function TTSPlayer({ 
  text, 
  voice = 'vi-VN-Wavenet-A',
  className = '',
  buttonText = '🔊 Nghe thử'
}: TTSPlayerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = async () => {
    if (!text || text.trim().length === 0) {
      setError('Không có nội dung để đọc');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Call Google TTS API
      const response = await fetch('/api/google-tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          voice: voice,
          speed: 1.0,
          pitch: 0
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Lỗi khi tạo giọng đọc');
      }

      if (!data.audio) {
        throw new Error('Không nhận được dữ liệu âm thanh');
      }

      // Create audio element and play
      const audio = new Audio(data.audio);
      audioRef.current = audio;

      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        setError('Lỗi khi phát âm thanh');
        setIsPlaying(false);
      };

      await audio.play();

    } catch (err) {
      console.error('TTS Error:', err);
      setError(err instanceof Error ? err.message : 'Lỗi không xác định');
    } finally {
      setIsLoading(false);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <div className={className}>
      <button
        onClick={isPlaying ? stopAudio : handlePlay}
        disabled={isLoading}
        className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-500/50 rounded-lg text-sm font-medium text-cyan-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Đang tạo...</span>
          </>
        ) : isPlaying ? (
          <>
            <Volume2 className="w-4 h-4 animate-pulse" />
            <span>Dừng</span>
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>{buttonText}</span>
          </>
        )}
      </button>

      {error && (
        <div className="mt-2 flex items-center space-x-2 text-red-400 text-xs">
          <AlertCircle className="w-3 h-3" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
