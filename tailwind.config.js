/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    colors: {
      primary: "#527094",
      white: "#ffffff",
      black: "#4b4b4b",
      grayLight: "#bebebe",
    },
  },
  plugins: [],
};
