/** @type {import('tailwindcss').Config} */
module.exports = {
  // Asegúrate de que esto apunte a tus carpetas correctas (app, components, etc)
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}