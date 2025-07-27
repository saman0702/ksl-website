/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Charte graphique KSL
        ksl: {
          red: '#D32F2F',
          'red-dark': '#B71C1C',
          'red-light': '#EF5350',
          white: '#FFFFFF',
          black: '#000000',
          gray: '#757575',
          'gray-light': '#BDBDBD',
          'gray-dark': '#424242'
        },
        // Mode sombre optimisé
        dark: {
          bg: '#1a1a1a',
          'bg-secondary':'#2d2d2d',
          'bg-tertiary':'#404040',
          text: '#e5e5e5',
          'text-secondary': '#b3b3b3'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-soft': 'bounceSoft 0.6s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        }
      },
      boxShadow: {
        'ksl': '0 4px 14px 0 rgba(211, 47, 47, 0.15)',
        'ksl-lg': '0 10px 25px 0 rgba(211, 47, 47, 0.2)',
      }
    },
  },
  plugins: [],
} 