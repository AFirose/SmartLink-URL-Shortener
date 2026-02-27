 /** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyan: {
          500: '#2acfcf',
          600: '#1e9a9a',
        },
        'dark-violet': '#3b3054',
        'very-dark-violet': '#232127',
      }
    },
  },
  plugins: [],
}