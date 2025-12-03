/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Montserrat: ["Montserrat", "sans-serif"],
      },
      colors: {
        "light-blue" :  "rgba(73, 168, 255, 0.1)",
        "dark-purple": "#081A51",
        "light-white": "rgba(255, 255, 255, 0.17)",
        "tx-color" : "rgb(21, 78, 193)",
        "br-color" : "rgba(73, 168, 255, 0.1)",
        "bg-dallas-cowboys-blue" : "#1560bd",
        "bg-college-navy" : "#13274F",
      },
    },
  },
  darkMode:"class",
  plugins: [],
}

