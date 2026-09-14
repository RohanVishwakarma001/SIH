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
        background: {
          DEFAULT: '#0B0F0E',
          secondary: '#111715',
        },
        surface: {
          DEFAULT: '#151C19',
          elevated: '#1A2420',
          hover: '#1E2B26',
        },
        border: {
          DEFAULT: '#26322D',
          subtle: '#1C2723',
          strong: '#364640',
        },
        med: {
          green: {
            DEFAULT: '#35D07F',
            secondary: '#6EE7A5',
            soft: '#A7F3C5',
            subtle: '#D1FAE5',
            muted: '#173E2E',
            glow: 'rgba(53, 208, 127, 0.15)',
          },
          text: {
            primary: '#F2F5F3',
            secondary: '#A8B3AE',
            muted: '#71807A',
          },
          urgent: {
            DEFAULT: '#EF4444',
            dark: '#DC2626',
            subtle: 'rgba(239, 68, 68, 0.15)',
            border: '#7F1D1D',
          },
          attention: {
            DEFAULT: '#F59E0B',
            subtle: 'rgba(245, 158, 11, 0.15)',
            border: '#78350F',
          },
          ayush: {
            DEFAULT: '#10B981',
            accent: '#34D399',
            subtle: 'rgba(16, 185, 129, 0.15)',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-green': '0 0 25px -5px rgba(53, 208, 127, 0.25)',
        'glow-green-sm': '0 0 15px -3px rgba(53, 208, 127, 0.2)',
        'glow-urgent': '0 0 25px -5px rgba(239, 68, 68, 0.25)',
        'surface': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wave': 'wave 1.5s ease-in-out infinite',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'scaleY(0.4)' },
          '50%': { transform: 'scaleY(1)' },
        }
      }
    },
  },
  plugins: [],
}
