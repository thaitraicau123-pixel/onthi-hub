/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        wayground: {
          dark: '#240618',
          wine: '#330a21',
          plum: '#491030',
          berry: '#5c163d',
          pink: '#f02c85',
          pinkHover: '#dc1f74',
          orange: '#ff5f38',
          cream: '#fcf7ec',
          creamCard: '#ffffff',
          creamHover: '#f5ecd8',
          text: '#28071a',
          muted: '#806173',
          border: '#eadecb',
        }
      }
    },
  },
  plugins: [],
}

