import type { Metadata } from 'next'
import './globals.css'
import AnimatedBackground from './components/AnimatedBackground'

export const metadata: Metadata = {
  title: 'BG Ai Tools - Công cụ AI Đa Nền Tảng',
  description: 'Giao diện phong cách Hacker chuyên nghiệp cho phân tích sản phẩm bằng trí tuệ nhân tạo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-mono bg-cyber-bg text-cyber-primary">
        {/* Animated Cyberpunk Background (Layer -1) */}
        <AnimatedBackground />
        
        {/* CRT Screen Effects */}
        <div className="scanline"></div>
        <div className="crt-screen"></div>
        <div className="noise"></div>
        
        {/* Main Content */}
        <main className="relative z-10">
          {children}
        </main>
      </body>
    </html>
  )
}
