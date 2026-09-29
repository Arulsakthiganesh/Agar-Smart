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
          DEFAULT: '#0B0F19',
          card: '#111827',
          surface: '#1F2937',
          header: '#0D111D',
          hover: '#374151',
        },
        primary: {
          DEFAULT: '#3B82F6',
          dark: '#1D4ED8',
          glow: '#60A5FA',
        },
        risk: {
          low: '#10B981',        // Green
          moderate: '#F59E0B',   // Yellow
          high: '#F97316',       // Orange
          severe: '#EF4444',     // Red
          critical: '#991B1B',   // Dark Red
        },
        status: {
          online: '#10B981',
          degraded: '#F59E0B',
          offline: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'sweep 4s linear infinite',
      },
      keyframes: {
        sweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
