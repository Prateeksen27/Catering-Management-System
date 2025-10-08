import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "#E5E7EB", // light gray border
        input: "#F9FAFB",
        ring: "#3B82F6",
        background: "#F8FAFC", // light background
        foreground: "#111827",

        primary: {
          DEFAULT: "#3B82F6",       // Tailwind blue-500
          foreground: "#FFFFFF",
          hover: "#2563EB",         // Tailwind blue-600
        },

        secondary: {
          DEFAULT: "#64748B",       // slate-500
          foreground: "#FFFFFF",
        },

        destructive: {
          DEFAULT: "#EF4444",       // red-500
          foreground: "#FFFFFF",
        },

        success: {
          DEFAULT: "#22C55E",       // green-500
          foreground: "#FFFFFF",
        },

        warning: {
          DEFAULT: "#FACC15",       // yellow-400
          foreground: "#111827",
        },

        muted: {
          DEFAULT: "#F1F5F9",       // slate-100
          foreground: "#6B7280",    // slate-500
        },

        accent: {
          DEFAULT: "#1E3A8A",       // blue-900
          foreground: "#FFFFFF",
        },

        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#111827",
        },

        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#111827",
        },

        sidebar: {
          DEFAULT: "#FFFFFF",
          active: "#3B82F6",
          "active-bg": "#EFF6FF",
          border: "#E5E7EB",
        },
      },

      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
