/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'adventure': ['Fredoka One', 'cursive'],
        'sans': ['Inter', 'sans-serif'],
      },
      colors: {
        adventure: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        magic: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        }
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'level-up': 'levelUp 0.5s ease-in-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      backgroundImage: {
        'adventure-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'magic-gradient': 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)',
        'gold-gradient': 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
      },
      boxShadow: {
        'adventure': '0 10px 25px -5px rgba(102, 126, 234, 0.3)',
        'magic': '0 10px 25px -5px rgba(168, 85, 247, 0.3)',
        'gold': '0 10px 25px -5px rgba(251, 191, 36, 0.3)',
      }
    },
  },
  plugins: [],
} 