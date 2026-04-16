/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        gold: '#a89060',
        text: '#1a1a1a',
        muted: '#6b6258',
        background: '#f9f7f5',
        placeholder: '#e8e3de'
      },
      fontFamily: {
        heading: ['Georgia', 'serif'],
        body: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: []
}
