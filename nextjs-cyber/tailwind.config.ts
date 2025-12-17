import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#000000',
          primary: '#00ff00',
          secondary: '#00ffff',
          accent: '#ff00ff',
          warning: '#ffff00',
          danger: '#ff0000',
          border: '#00ff0066',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-green': '0 0 10px rgba(0, 255, 0, 0.5), 0 0 20px rgba(0, 255, 0, 0.3)',
        'glow-cyan': '0 0 10px rgba(0, 255, 255, 0.5), 0 0 20px rgba(0, 255, 255, 0.3)',
      },
    },
  },
  plugins: [],
}
export default config
