/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#050508',
          900: '#0a0a10',
          800: '#101018',
          700: '#181820',
          600: '#202030',
        },
        steel: {
          100: '#e8eef5',
          200: '#c5d3e8',
          300: '#9eb4d4',
          400: '#7a9bc4',
          500: '#5a7fa8',
          600: '#4a6a8c',
        },
        crystal: {
          blue: '#6b8cad',
          highlight: '#8fa8c4',
          edge: '#4a6080',
        }
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
        'gradient': 'gradient 8s ease infinite',
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'shimmer': 'shimmer 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(107, 140, 173, 0.1)' },
          '100%': { boxShadow: '0 0 40px rgba(107, 140, 173, 0.25)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
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
