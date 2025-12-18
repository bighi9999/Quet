'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Image as ImageIcon, 
  Video, 
  Mic, 
  Settings,
  Menu,
  X
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <Home className="w-5 h-5" />,
    href: '/'
  },
  {
    id: 'image-gen',
    label: 'Tạo Ảnh',
    icon: <ImageIcon className="w-5 h-5" />,
    href: '/tools/image-generator'
  },
  {
    id: 'video-gen',
    label: 'Tạo Video',
    icon: <Video className="w-5 h-5" />,
    href: '/tools/video-generator'
  },
  {
    id: 'voice',
    label: 'Giọng Đọc',
    icon: <Mic className="w-5 h-5" />,
    href: '/google-cloud'
  },
  {
    id: 'tools',
    label: 'Công Cụ',
    icon: <Settings className="w-5 h-5" />,
    href: '/tools'
  }
];

export default function TopNavigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-b border-cyan-500/30">
      {/* Desktop Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-3 group"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-xl">BG</span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                BG AI Tools
              </h1>
              <p className="text-xs text-gray-400">Google Cloud Edition</p>
            </div>
          </Link>

          {/* Desktop Menu Items */}
          <div className="hidden md:flex items-center space-x-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`
                    relative px-4 py-2 rounded-lg flex items-center space-x-2 
                    transition-all duration-300 group
                    ${active 
                      ? 'bg-cyan-500/20 text-cyan-400 shadow-lg shadow-cyan-500/50' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  {/* Neon Glow Effect for Active Item */}
                  {active && (
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg blur-sm"></div>
                  )}
                  
                  <span className="relative z-10">{item.icon}</span>
                  <span className="relative z-10 font-medium">{item.label}</span>
                  
                  {/* Animated Underline */}
                  {active && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500"></div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-cyan-500/30 animate-slideDown">
          <div className="px-4 py-4 space-y-2">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300
                    ${active 
                      ? 'bg-cyan-500/20 text-cyan-400 shadow-lg shadow-cyan-500/30' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Animated Border Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
    </nav>
  );
}
