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
        'gray-333': "#333",
        'gray-18': "#181818",
        'white-kinda': "#ccc",
      },
      height: {
        p5: "5%",
        '9/10': "90%",
        '1/10': "10%",
      },
      inset: {
        '2/5': "40%",
        '3.5': "0.9rem",
        '29': '7.25rem'
      },
      screens: {
        xxl: "1921px",
      },
      maxWidth: {
        '1/5': "20%"
      },
      flex: {
        '2': '2',
        '3': '3',
        '4': '4',
        '5': '5',
        '6': '6'
      }
    },
  },
  plugins: [],
}

