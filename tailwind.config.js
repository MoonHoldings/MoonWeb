/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      sm: '576px',
      md: '960px',
      lg: '1440px',
    },
    fontFamily: {
      poppins: ['Poppins', ...defaultTheme.fontFamily.sans],
      inter: ['Inter', ...defaultTheme.fontFamily.sans],
    },
    extend: {},
  },
  plugins: [],
}
