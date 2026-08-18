/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { 'text-shadow': '0 0 20px rgba(139, 92, 246, 0.5)' },
          '50%': { 'text-shadow': '0 0 30px rgba(139, 92, 246, 0.8)' },
        },
      },
      boxShadow: {
        'glow-purple': '0 0 30px rgba(139, 92, 246, 0.5)',
        'glow-blue': '0 0 30px rgba(59, 130, 246, 0.5)',
        'deep': '0 20px 40px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
