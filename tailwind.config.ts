import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Rosa bebê (Rebeca)
        pink: {
          50: "#FFF5F7",
          100: "#FCE7EC",
          200: "#F9CFD8",
          300: "#F4A8B8",
          400: "#EC8199",
          500: "#E15B7E",
          600: "#C74366",
          700: "#9E3251",
          800: "#75253C",
          900: "#4C1826",
          DEFAULT: "#F4A8B8",
        },
        // Azul marinho (Robin)
        navy: {
          50: "#EEF1F8",
          100: "#D5DCEE",
          200: "#A9B6DC",
          300: "#7D8FC9",
          400: "#5169B6",
          500: "#334C9C",
          600: "#263A7A",
          700: "#1A2A5C",
          800: "#111E45",
          900: "#0A1533",
          DEFAULT: "#1A2A5C",
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
