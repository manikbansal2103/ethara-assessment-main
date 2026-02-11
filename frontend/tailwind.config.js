/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep Space Theme (Dark)
        'aura-dark': 'rgb(var(--aura-dark) / <alpha-value>)',
        'aura-dark-surface': 'rgb(var(--aura-dark-surface) / <alpha-value>)',
        'aura-dark-border': 'rgb(var(--aura-dark-border) / <alpha-value>)',
        'aura-dark-text': 'rgb(var(--aura-dark-text) / <alpha-value>)',
        'aura-dark-muted': 'rgb(var(--aura-dark-muted) / <alpha-value>)',
        'aura-light': 'rgb(var(--aura-light) / <alpha-value>)',
        'aura-light-surface': 'rgb(var(--aura-light-surface) / <alpha-value>)',
        'aura-light-border': 'rgb(var(--aura-light-border) / <alpha-value>)',
        'aura-light-text': 'rgb(var(--aura-light-text) / <alpha-value>)',
        'aura-light-muted': 'rgb(var(--aura-light-muted) / <alpha-value>)',
        'aura-light-border-pure': '#f0f0f0', // Backup for non-opacity utilities
        // Radiant Violet Accent
        accent: {
          primary: {
            50: '#f5f3ff',
            100: '#ede9fe',
            200: '#ddd6fe',
            300: '#c4b5fd',
            400: '#a78bfa',
            500: '#8b5cf6', // Main accent
            600: '#7c3aed',
            700: '#6d28d9',
          },
          secondary: {
            500: '#f59e0b', // Sunset Orange
          }
        },
        // Functional
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'aura-glow': '0 0 20px -5px rgba(139, 92, 246, 0.3)',
        'aura-glass': '0 8px 32px 0 rgba(0, 0, 0, 0.05)',
        'aura-glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
      },
      backgroundImage: {
        'aura-gradient': 'radial-gradient(circle at top right, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
