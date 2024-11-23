/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        outfit: ["Outfit", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        wpBlue: {
          DEFAULT: "#0B4159",
        },
        wpGreen: {
          DEFAULT: "#8DD0A4",
        },
        wpWhite: {
          DEFAULT: "#F6F9FB",
        },
        wpBrown: {
          DEFAULT: "#F2EFE6",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
