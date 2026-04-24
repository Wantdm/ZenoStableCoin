/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#0a0b0d',
          surface: '#121317',
          elevated: '#17181c',
          sidebar: '#0e0f12',
        },
        border: {
          subtle: '#23252b',
          DEFAULT: '#2a2c33',
        },
        text: {
          primary: '#e7e9ec',
          secondary: '#a1a5ad',
          muted: '#6b6f78',
        },
        brand: {
          50: '#e9fcef',
          300: '#6ee7a3',
          400: '#3bd77a',
          500: '#22c55e',
          600: '#16a34a',
          700: '#0f7a38',
        },
        info: {
          500: '#3b82f6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'glow-green': '0 0 0 1px rgba(34,197,94,0.25), 0 8px 24px -12px rgba(34,197,94,0.4)',
      },
    },
  },
  plugins: [],
}
