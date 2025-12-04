/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Routine Forge Theme - Dark Tech Health Aesthetic
        primary: {
          bg: "#222222", // Dark primary background
          surface: "#2A2A2A", // Elevated surfaces
          "surface-alt": "#333333", // Alternative surface
        },
        accent: {
          DEFAULT: "#cbff00", // Primary vibrant lime (energy/focus)
          light: "#d6ff33",
          dark: "#b3e600",
          secondary: "#dbfe52", // Secondary pink analog (interactive states)
        },
        border: {
          DEFAULT: "#3A3A3A", // Subtle borders
          strong: "#4A4A4A", // Emphasized borders
          muted: "#2E2E2E", // Very subtle borders
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#C9C9C9",
          muted: "#787878",
          accent: "#cbff00",
        },
        // Legacy compatibility (mapped to new theme)
        base: "#222222",
        surface: "#2A2A2A",
        "surface-alt": "#333333",
        "brand-border": "#3A3A3A",
        "brand-border-strong": "#4A4A4A",
        muted: "#787878",
        neutral: {
          950: "#0E0E0E",
          900: "#1A1A1A",
          800: "#2A2A2A",
          700: "#3A3A3A",
          600: "#4A4A4A",
          500: "#787878",
          400: "#9A9A9A",
          300: "#C9C9C9",
        },
        // State colors
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
        info: "#3b82f6",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        display: ["Space Grotesk", "Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.875rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        88: "22rem",
        104: "26rem",
        112: "28rem",
        128: "32rem",
      },
      boxShadow: {
        "sm-accent": "0 1px 2px 0 rgba(203, 255, 0, 0.05)",
        "md-accent": "0 4px 6px -1px rgba(203, 255, 0, 0.1), 0 2px 4px -1px rgba(203, 255, 0, 0.06)",
        "lg-accent": "0 10px 15px -3px rgba(203, 255, 0, 0.15), 0 4px 6px -2px rgba(203, 255, 0, 0.08)",
        "xl-accent": "0 20px 25px -5px rgba(203, 255, 0, 0.2), 0 10px 10px -5px rgba(203, 255, 0, 0.1)",
        "inner-accent": "inset 0 2px 4px 0 rgba(203, 255, 0, 0.06)",
        glow: "0 0 20px rgba(203, 255, 0, 0.3)",
        "glow-lg": "0 0 40px rgba(203, 255, 0, 0.4)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      transitionDuration: {
        250: "250ms",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(203, 255, 0, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(203, 255, 0, 0.5)" },
        },
      },
    },
  },
  plugins: [],
};
