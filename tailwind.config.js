/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Strict VÉLORA Brand Palette
        blush: {
          DEFAULT: '#F8E9E7',
          light: '#FBF2F0',
          50: '#FFF9F5',
          100: '#F8E9E7',
          200: '#E8C6C2',
          300: '#DCAFA9',
        },
        rose: {
          50: '#FFF9F5',
          100: '#F8E9E7',
          200: '#E8C6C2',
          300: '#DCAFA9',
          400: '#C58B83', // Primary brand colour for buttons & accents
          500: '#B0756D',
          600: '#9B6B64', // Dark rose for headings & hover emphasis
          700: '#83544D',
          800: '#5E3B36',
          900: '#3D2522',
        },
        card: {
          DEFAULT: '#FFF9F5',
          soft: '#FBF4F0',
        },
        velora: {
          blush: '#F8E9E7',
          secondary: '#E8C6C2',
          primary: '#C58B83',
          dark: '#9B6B64',
          card: '#FFF9F5',
          ink: '#3D2D2A',
          muted: '#8C7471',
          border: '#E8C6C2',
        },
        // Backward-compatible semantic aliases
        canvas: {
          DEFAULT: '#F8E9E7',
          dark: '#231816'
        },
        surface: {
          DEFAULT: '#FFF9F5',
          dark: '#2E201E'
        },
        ink: {
          DEFAULT: '#3D2D2A',
          dark: '#FBF2F0'
        },
        muted: {
          DEFAULT: '#8C7471',
          dark: '#DCAFA9'
        },
        'stone-line': {
          DEFAULT: '#E8C6C2',
          dark: '#4A3430'
        },
        gold: {
          DEFAULT: '#C58B83',
          light: '#E8C6C2',
          dark: '#9B6B64'
        },
        clay: {
          DEFAULT: '#9B6B64',
          dark: '#DCAFA9'
        },
        // Subtle accessible queue status accents
        status: {
          waiting: '#D97706',
          'waiting-bg': '#FEF3C7',
          'waiting-border': '#FDE68A',
          progress: '#2563EB',
          'progress-bg': '#DBEAFE',
          'progress-border': '#BFDBFE',
          completed: '#059669',
          'completed-bg': '#D1FAE5',
          'completed-border': '#A7F3D0',
          cancelled: '#DC2626',
          'cancelled-bg': '#FEE2E2',
          'cancelled-border': '#FECACA'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'Jost', '"Noto Sans Gujarati"', 'system-ui', 'sans-serif'],
        gujarati: ['"Noto Sans Gujarati"', '"DM Sans"', 'sans-serif']
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(155, 107, 100, 0.08), 0 2px 6px -2px rgba(155, 107, 100, 0.04)',
        'card-hover': '0 10px 25px -3px rgba(155, 107, 100, 0.14), 0 4px 10px -2px rgba(155, 107, 100, 0.08)',
        'rose': '0 4px 15px 0 rgba(197, 139, 131, 0.35)',
        'rose-lg': '0 8px 25px 0 rgba(197, 139, 131, 0.45)',
      },
      letterSpacing: {
        'widest-plus': '0.22em',
        'super': '0.30em'
      },
      animation: {
        'marquee': 'marquee 35s linear infinite',
        'marquee-slow': 'marquee 50s linear infinite',
        'fade-in': 'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 2.5s ease-in-out infinite',
        'call-flash': 'callFlash 1.5s ease-in-out infinite'
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.88', transform: 'scale(1.02)' }
        },
        callFlash: {
          '0%, 100%': { borderColor: '#C58B83', boxShadow: '0 0 25px rgba(197, 139, 131, 0.45)' },
          '50%': { borderColor: '#9B6B64', boxShadow: '0 0 35px rgba(155, 107, 100, 0.6)' }
        }
      }
    },
  },
  plugins: [],
}
