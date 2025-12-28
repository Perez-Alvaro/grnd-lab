/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // GRIND LAB Theme - Technical Precision Aesthetic
        primary: {
          bg: "#0B0B0F", // Deep black foundation
          surface: "#141419", // Elevated surfaces
          "surface-alt": "#1A1A20", // Alternative surface
          "surface-elevated": "#20202A", // Highest elevation
        },
        accent: {
          DEFAULT: "#5227FF", // Purple - technical precision
          light: "#6B42FF",
          dark: "#3D1FCC",
          subtle: "rgba(82, 39, 255, 0.1)",
          secondary: "#FF9FFC", // Pink analog (rare use)
        },
        border: {
          DEFAULT: "#2A2A35", // Subtle borders
          strong: "#35354A", // Emphasized borders
          muted: "#1F1F28", // Very subtle borders
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#C8C8D2",
          tertiary: "#8C8CA0",
          quaternary: "#646478",
          muted: "#8C8CA0",
          accent: "#5227FF",
        },
        // Legacy compatibility
        base: "#0B0B0F",
        surface: "#141419",
        "surface-alt": "#1A1A20",
        "brand-border": "#2A2A35",
        "brand-border-strong": "#35354A",
        muted: "#8C8CA0",
        neutral: {
          950: "#0B0B0F",
          900: "#141419",
          800: "#1A1A20",
          700: "#2A2A35",
          600: "#35354A",
          500: "#8C8CA0",
          400: "#A0A0B8",
          300: "#C8C8D2",
        },
        // State colors - desaturated
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
        info: "#3b82f6",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "SF Mono", "Monaco", "Cascadia Code", "Courier New", "monospace"],
        display: ["Inter", "-apple-system", "sans-serif"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.6" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.875rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1.1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
      },
      letterSpacing: {
        tighter: "-0.025em",
        tight: "-0.015em",
        normal: "0em",
        wide: "0.015em",
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
        "sm-accent": "0 1px 2px 0 rgba(82, 39, 255, 0.05)",
        "md-accent": "0 4px 6px -1px rgba(82, 39, 255, 0.1), 0 2px 4px -1px rgba(82, 39, 255, 0.06)",
        "lg-accent": "0 10px 15px -3px rgba(82, 39, 255, 0.15), 0 4px 6px -2px rgba(82, 39, 255, 0.08)",
        "xl-accent": "0 20px 25px -5px rgba(82, 39, 255, 0.15), 0 10px 10px -5px rgba(82, 39, 255, 0.08)",
        "inner-accent": "inset 0 2px 4px 0 rgba(82, 39, 255, 0.06)",
        glow: "0 0 20px rgba(82, 39, 255, 0.15)",
        "glow-lg": "0 0 30px rgba(82, 39, 255, 0.2)",
        subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)",
        medium: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      transitionDuration: {
        200: "200ms",
        250: "250ms",
        300: "300ms",
      },
      transitionTimingFunction: {
        "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "fade-in-up": "fadeInUp 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "subtle-glow": "subtleGlow 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        subtleGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(82, 39, 255, 0)" },
          "50%": { boxShadow: "0 0 20px 0 rgba(82, 39, 255, 0.15)" },
        },
      },
    },
  },
  plugins: [],
};
