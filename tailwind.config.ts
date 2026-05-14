import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#04060c",
          900: "#0a0f1f",
          800: "#111a33",
          700: "#1a2447",
          600: "#28335f",
        },
        bolt: {
          400: "#7dd3fc",
          500: "#38bdf8",
          600: "#0ea5e9",
        },
        siren: {
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
        },
        amber: {
          400: "#fbbf24",
          500: "#f59e0b",
        },
      },
      fontFamily: {
        display: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
      },
      backgroundImage: {
        "storm-radial": "radial-gradient(120% 100% at 50% 0%, #1a2447 0%, #0a0f1f 50%, #04060c 100%)",
        "siren-pulse": "linear-gradient(135deg, #dc2626 0%, #f59e0b 100%)",
      },
      animation: {
        pulseSlow: "pulseSlow 2.4s ease-in-out infinite",
        shimmer: "shimmer 6s linear infinite",
      },
      keyframes: {
        pulseSlow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.45" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
