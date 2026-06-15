/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb', // blue-600
          hover: '#1d4ed8',   // blue-700
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#4b5563', // gray-600
          hover: '#374151',   // gray-700
          foreground: '#ffffff',
        },
        tertiary: '#9ca3af', // gray-400
        quaternary: '#e5e7eb', // gray-200
      }
    },
  },
  plugins: [],
}
