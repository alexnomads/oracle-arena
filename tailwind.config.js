/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        foreground: '#ffffff',
        'accent-cyan': '#00f0ff',
        'accent-gold': '#ffd700',
        'accent-magenta': '#ff00ff',
        border: 'rgba(255, 255, 255, 0.1)',
      },
    },
  },
  plugins: [],
}
