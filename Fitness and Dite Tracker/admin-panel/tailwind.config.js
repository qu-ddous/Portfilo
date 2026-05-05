/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          green: '#4CAF50',
          blue: '#2196F3',
          DEFAULT: '#4CAF50',
        },
        accent: {
          orange: '#FF9800',
          purple: '#9C27B0',
          cyan: '#00BCD4',
        },
        bg: {
          dark: '#0F1419',
          card: 'rgba(255, 255, 255, 0.05)',
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
