/** @type {import('tailwindcss').Config} */
const {platformSelect, platformColor} = require("nativewind/theme");
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
  },
  presets: [
    require("nativewind/preset")
  ],
  plugins: [],
};