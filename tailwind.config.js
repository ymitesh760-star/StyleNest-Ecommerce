/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          DEFAULT: '#4A0E1C', // Primary Burgundy
          dark: '#2A0710',    // Dark Burgundy
          wine: '#651C2D',    // Wine Red
          deep: '#1E050B',
          text: '#32141B',    // Elegant Dark Text
          muted: '#89786C',   // Muted Text
          subtle: 'rgba(74, 14, 28, 0.08)',
          border: 'rgba(74, 14, 28, 0.18)',
        },
        champagne: {
          DEFAULT: '#D8BD83', // Champagne
          hover: '#C7A96C',
          muted: '#BBA067',
          dark: '#9F8054',
          light: '#F4EBD9',
          border: 'rgba(216, 189, 131, 0.32)',
          subtle: 'rgba(216, 189, 131, 0.14)',
        },
        ivory: {
          DEFAULT: '#F8F0E2', // Warm Ivory
          warm: '#F8F0E2',
          cream: '#F2E6D2',   // Soft Cream
          soft: '#FAF5ED',
        },
        stylenest: {
          950: '#2A0710', // Dark Burgundy
          900: '#32141B', // Elegant Dark Text
          850: '#4A0E1C', // Primary Burgundy
          800: '#651C2D', // Wine Red
          700: '#5C3843',
          600: '#755560',
          500: '#89786C', // Muted Text
          400: '#B0A296',
          300: '#D5CBC0',
          200: '#EAE1D5',
          100: '#F2E6D2', // Soft Cream
          50: '#F8F0E2',  // Warm Ivory
          gold: {
            DEFAULT: '#D8BD83', // Champagne
            hover: '#C7A96C',
            muted: '#BBA067',
            dark: '#9F8054',
            light: '#F4EBD9',
            subtle: 'rgba(216, 189, 131, 0.14)',
            border: 'rgba(216, 189, 131, 0.32)',
          },
          ivory: '#F8F0E2',
          charcoal: '#32141B',
        },
        elan: {
          950: '#2A0710',
          900: '#32141B',
          850: '#4A0E1C',
          800: '#651C2D',
          700: '#5C3843',
          600: '#755560',
          500: '#89786C',
          400: '#B0A296',
          300: '#D5CBC0',
          200: '#EAE1D5',
          100: '#F2E6D2',
          50: '#F8F0E2',
          gold: {
            DEFAULT: '#D8BD83',
            hover: '#C7A96C',
            muted: '#BBA067',
            dark: '#9F8054',
            light: '#F4EBD9',
            subtle: 'rgba(216, 189, 131, 0.14)',
            border: 'rgba(216, 189, 131, 0.32)',
          },
        }
      },
      borderColor: {
        'luxury-gold': 'rgba(216, 189, 131, 0.32)',
        'luxury-burgundy': 'rgba(74, 14, 28, 0.20)',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Bodoni Moda"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Bodoni Moda"', '"Playfair Display"', 'Georgia', 'serif'],
        editorial: ['"Italiana"', '"Bodoni Moda"', '"Cormorant Garamond"', 'serif'],
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
