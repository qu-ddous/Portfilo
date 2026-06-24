/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366f1',
          dark: '#4f46e5',
          light: '#818cf8'
        },
        accent: {
          DEFAULT: '#f59e0b',
          dark: '#d97706'
        },
        surface: {
          DEFAULT: '#0f172a',
          card: '#1e293b',
          border: '#334155'
        },
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
      },
      fontFamily: {
        display: ['Clash Display', 'sans-serif'],
        body: ['Satoshi', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'particle': 'particle 8s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        pulseGlow: {
          '0%,100%': { boxShadow: '0 0 20px rgba(99,102,241,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(99,102,241,0.7)' }
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
