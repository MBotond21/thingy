/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/index.html',
    './src/pages/*.tsx',
    './src/components/*.tsx'
  ],
  theme: {
    extend: {
      colors: {
        gray222: "#222",
        gray28: "#282828",
      },
      height: {
        p5: "5%", 
      },
      inset: {
        '2/5': "40%",
      }
    },
  },
  plugins: [],
}

