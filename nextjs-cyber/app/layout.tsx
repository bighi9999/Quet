import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CYBER WEBAPP | AI Product Analyzer',
  description: 'Hacker-style cyberpunk interface for AI product analysis',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-mono bg-cyber-bg text-cyber-primary">
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
