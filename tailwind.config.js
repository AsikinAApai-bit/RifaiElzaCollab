/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: '#020807',
        canopy: '#0a1f12',
        moss: '#132e1a',
        mist: '#d4e8d9',
        ember: '#f59e0b',
      },
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
        mono: ['DM Mono', 'Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
}
