import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: ["page-gutter-x", "app-page", "app-form-field", "app-form", "form-field-row"],
  theme: {
    screens: {
      xs: "380px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        cream: "#faf8f5",
        sage: {
          50: "#f4f7f4",
          100: "#e3ebe3",
          200: "#c5d6c5",
          300: "#9fb89f",
          400: "#739673",
          500: "#527852",
          600: "#3f5f3f",
          700: "#344d34",
          800: "#2c3f2c",
        },
        warm: {
          800: "#5c4f42",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "scale-in": "scaleIn 0.4s ease-out",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.9)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        pulseSoft: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.03)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
