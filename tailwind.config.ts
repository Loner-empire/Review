import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fef5e7",
          100: "#fde8c2",
          200: "#fbd08a",
          300: "#f9b34a",
          400: "#f79522",
          500: "#e8770a",
          600: "#c95c06",
          700: "#a44309",
          800: "#86360f",
          900: "#6f2e10",
        },
        slate: {
          950: "#0a0f1a",
        },
      },
      fontFamily: {
        sans: ["var(--font-body)", "Georgia", "serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        mono: ["ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
