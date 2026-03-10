/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF6B35",
        secondary: "#004E89",
        light: "#F7F7F7",
        dark: "#1A1A1A",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 12px rgba(0, 0, 0, 0.1)",
        hover: "0 8px 24px rgba(0, 0, 0, 0.15)",
      },
      transition: {
        smooth: "all 0.3s ease-in-out",
      },
    },
  },
  plugins: [],
}
