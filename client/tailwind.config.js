/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d7fe',
          300: '#a4b9fc',
          400: '#8192f9',
          500: '#6376f4',
          600: '#4a54e8',
          700: '#3d3dd4',
          800: '#3434b1',
          900: '#343494',
        },
      },
    },
  },
  plugins: [],
}

