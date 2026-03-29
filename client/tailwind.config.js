/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          900: '#1e3a8a', // Adjust if needed to match specific IAU blue
        },
        amber: {
          500: '#f59e0b',
        },
      },
    },
  },
  plugins: [],
}
