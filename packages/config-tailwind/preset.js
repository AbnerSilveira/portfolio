/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        // Design tokens do portfólio — ajustar após definir identidade visual
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
