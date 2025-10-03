/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4A90E2",
        secondary: "#5C6BC0",
        accent: "#FFA726",
        success: "#66BB6A",
        warning: "#FFA726",
        error: "#EF5350",
        info: "#42A5F5",
        surface: "#FFFFFF",
        background: "#F5F7FA"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};