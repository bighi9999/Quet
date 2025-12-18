import type { Metadata } from 'next'
import './globals.css'
import AnimatedBackground from './components/AnimatedBackground'

export const metadata: Metadata = {
  title: 'BG Ai Tools - Công cụ AI Đa Nền Tảng',
  description: 'Nền tảng AI toàn diện: Phân tích sản phẩm, tạo nội dung marketing, và tạo ảnh model AI chuyên nghiệp',
  manifest: '/manifest.json',
  themeColor: '#667eea',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'BG AI Tools'
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true
  },
  icons: {
    icon: '/icon-192x192.png',
    apple: '/icon-512x512.png'
  }
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
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#667eea" />
        <link rel="apple-touch-icon" href="/icon-512x512.png" />
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
