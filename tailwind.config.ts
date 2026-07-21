import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: "#fdf9e7",
          100: "#faf0bf",
          400: "#f4c430",
          500: "#d4a017",
          600: "#b8860b",
          700: "#8b6914",
        },
        estate: {
          50: "#f0f7f4",
          100: "#d9ede2",
          500: "#0f766e",
          600: "#0d5d56",
          700: "#0a4a44",
          800: "#073b37",
          900: "#042f2b",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Playfair Display", "serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;