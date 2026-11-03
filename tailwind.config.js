/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        stylenest: {
          950: '#0A0A0A', // Deep black
          900: '#171717', // Charcoal
          850: '#1F1F1F',
          800: '#262626',
          700: '#404040',
          600: '#525252',
          500: '#777777', // Soft grey
          400: '#A3A3A3',
          300: '#D4D4D4',
          200: '#E5E5E5',
          100: '#EFECE6',
          50: '#F8F6F2', // Warm ivory
          gold: {
            DEFAULT: '#B99A6B', // Champagne gold
            hover: '#A5855B',
            muted: '#9F8054', // Muted gold
            dark: '#87693E',
            light: '#F8F6F2',
            subtle: 'rgba(185, 154, 107, 0.12)',
            border: 'rgba(185, 154, 107, 0.22)',
          },
          ivory: '#F8F6F2',
          charcoal: '#171717',
        },
        elan: {
          950: '#0A0A0A',
          900: '#171717',
          850: '#1F1F1F',
          800: '#262626',
          700: '#404040',
          600: '#525252',
          500: '#777777',
          400: '#A3A3A3',
          300: '#D4D4D4',
          200: '#E5E5E5',
          100: '#EFECE6',
          50: '#F8F6F2',
          gold: {
            DEFAULT: '#B99A6B',
            hover: '#A5855B',
            muted: '#9F8054',
            dark: '#87693E',
            light: '#F8F6F2',
            subtle: 'rgba(185, 154, 107, 0.12)',
            border: 'rgba(185, 154, 107, 0.22)',
          },
        }
      },
      borderColor: {
        'luxury-gold': 'rgba(185, 154, 107, 0.22)',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      letterSpacing: {
        'widest-luxury': '0.22em',
        'wider-luxury': '0.14em',
        'ultrawide': '0.3em',
      },
      boxShadow: {
        'luxury': '0 10px 40px -10px rgba(0, 0, 0, 0.08)',
        'luxury-hover': '0 20px 45px -12px rgba(0, 0, 0, 0.16)',
        'luxury-gold': '0 10px 30px -10px rgba(185, 154, 107, 0.25)',
        'drawer': '-10px 0 35px -5px rgba(0, 0, 0, 0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down': 'slideDown 0.35s ease-out forwards',
        'subtle-zoom': 'subtleZoom 20s ease-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        subtleZoom: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [],
}
