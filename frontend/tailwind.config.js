/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#1D9E75',
          light: '#E1F5EE',
          dark: '#0F6E56',
          amber: '#D97706',
          danger: '#D64545'
        }
      },
      boxShadow: {
        app: '0 24px 60px rgba(15, 110, 86, 0.16)'
      },
      keyframes: {
        pulseDot: {
          '0%, 80%, 100%': { opacity: '0.3', transform: 'translateY(0)' },
          '40%': { opacity: '1', transform: 'translateY(-2px)' }
        }
      },
      animation: {
        'pulse-dot': 'pulseDot 1.2s infinite ease-in-out'
      }
    }
  },
  plugins: []
};
