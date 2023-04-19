/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: 'class',
  content: [
    './node_modules/flowbite-react/**/*.js',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      poppins: ['Poppins', ...defaultTheme.fontFamily.sans],
      inter: ['Inter', ...defaultTheme.fontFamily.sans],
    },
    extend: {
      screens: {
        '3xl': '1920px',
        '4xl': '2560px',
      },
      transitionDuration: {
        300: '300ms',
      },
      translate: {
        0: '0',
        '-full': '-100%',
      },
    },
  },
}
