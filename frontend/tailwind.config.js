/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}", // ✨ Yeh line aapki saari subfolders ko trace karegi
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }