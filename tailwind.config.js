/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gray: '#787878',
        jet: '#2D2D2D',
        'eerie-black': '#202020',
        lime: '#CBFF00',
        chartreuse: '#DBFE52',
        mindaro: '#F8FE9F'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
};