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
        bhumi: {
          darker: '#090d16',
          dark: '#0f172a',
          card: '#1e293b',
          cardHover: '#334155',
          border: '#334155',
          primary: '#3b82f6',
          secondary: '#06b6d4',
          accent: '#38bdf8',
          success: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
          textMuted: '#94a3b8',
          textBright: '#f8fafc'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
