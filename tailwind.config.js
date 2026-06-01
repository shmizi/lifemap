/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: {
          900: '#0a0a0f',
          800: '#12121a',
          700: '#1c1c28',
          600: '#2a2a3d',
          500: '#3d3d5c',
        },
        lime: {
          400: '#c8f135',
          500: '#aed629',
          600: '#8fb520',
        },
        slate: {
          muted: '#6b7280',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bar-grow': 'barGrow 0.6s ease-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        barGrow: { from: { width: '0%' }, to: {} },
      }
    },
  },
  plugins: [],
}
