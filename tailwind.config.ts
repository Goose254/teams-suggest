import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        teams: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'system-ui', 'sans-serif'],
      },
      colors: {
        teams: {
          bg: '#141414',
          surface: '#1f1f1f',
          input: '#262626',
          border: '#3a3a3a',
          accent: '#7f85f5',
          'accent-glow': '#6a6dff',
          pill: '#292929',
          muted: '#a9a9a9',
        },
      },
      animation: {
        'fade-in': 'fadeIn 300ms ease',
        'slide-up': 'slideUp 400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        'shake': 'shake 500ms ease',
        'gradient': 'gradientShift 6s ease infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '15%': { transform: 'translateX(-4px) rotate(-0.5deg)' },
          '30%': { transform: 'translateX(3px) rotate(0.3deg)' },
          '45%': { transform: 'translateX(-2px) rotate(-0.2deg)' },
          '60%': { transform: 'translateX(1px)' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}

export default config
