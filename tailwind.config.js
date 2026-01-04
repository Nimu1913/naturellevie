/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        linen: {
          50: '#FAF9F6',
          100: '#F5F3F0',
          200: '#F0EDE8',
          300: '#E8E5E0',
          400: '#D9D5CE',
        },
        charcoal: {
          50: '#F5F5F5',
          100: '#E8E8E8',
          200: '#D0D0D0',
          300: '#9A9A9A',
          400: '#5A5A5A',
          500: '#3A3A3A',
        },
        sage: {
          50: '#F2F5F0',
          100: '#E0E8D8',
          200: '#C4D4B8',
          300: '#6B8E5A',
          400: '#5A7A4A',
          500: '#4A5F3D',
          600: '#3D4F32',
        },
        earth: {
          50: '#F5F3F0',
          100: '#E8E5E0',
          200: '#D4D0C8',
          300: '#A89B8A',
          400: '#8B7A6A',
          500: '#6B5D4F',
          600: '#5A4D42',
        },
        terracotta: {
          50: '#FAF6F2',
          100: '#F5EDE5',
          200: '#EBDBCC',
          300: '#C8955A',
          400: '#A87A4A',
          500: '#8B6340',
          600: '#6B4D32',
        },
        forest: {
          50: '#F0F4F0',
          100: '#D8E5D8',
          200: '#B8C4B8',
          300: '#5A7A5A',
          400: '#4A5F4A',
          500: '#3D4F3D',
        },
      },
      fontFamily: {
        display: ['IBM Plex Mono', 'monospace'],
        body: ['Poppins', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      letterSpacing: {
        'wide': '0.1em',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backgroundSize: {
        '300%': '300%',
        '400%': '400%',
      },
    },
  },
  plugins: [],
}
