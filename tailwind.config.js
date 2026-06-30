/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: {
          800: '#1a1a2e',
          700: '#16213e',
          600: '#0f3460',
          500: '#1e293b',
          400: '#334155',
        },
        crimson: {
          500: '#dc2626',
          600: '#b91c1c',
          700: '#991b1b',
          400: '#f87171',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        emerald: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'waveform': 'waveform 1.2s ease-in-out infinite',
        'slide-in': 'slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'type-cursor': 'typeCursor 0.8s step-end infinite',
        'dial-rotate': 'dialRotate 1.5s ease-out forwards',
        'toast-slide': 'toastSlide 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        waveform: {
          '0%, 100%': { height: '20%' },
          '50%': { height: '100%' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        typeCursor: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        dialRotate: {
          '0%': { transform: 'rotate(-180deg)' },
          '100%': { transform: 'rotate(var(--dial-angle, 0deg))' },
        },
        toastSlide: {
          '0%': { transform: 'translateX(120%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
