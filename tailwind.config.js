/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "var(--color-bg)",
        surface: "var(--color-surface)",
        "surface-alt": "var(--color-surface-alt)",
        "brand-border": "var(--color-border)",
        "brand-border-strong": "var(--color-border-strong)",
        accent: "var(--color-accent)",
        "accent-strong": "var(--color-accent-strong)",
        "accent-dark": "var(--color-accent-dark)",
        muted: "var(--color-muted)",
        neutral: {
          950: "var(--color-bg)",
          900: "var(--color-surface)",
          800: "var(--color-border)",
          700: "var(--color-border-strong)",
        },
        lime: {
          400: "var(--color-accent)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
