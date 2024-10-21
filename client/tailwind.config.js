/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'l': '1200px',
        'm': '768px',
        's': '480px',
      },
    },
  },
  plugins: [],
}

