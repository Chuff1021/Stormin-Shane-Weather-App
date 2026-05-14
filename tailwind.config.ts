import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          '"SF Pro Text"',
          "system-ui",
          "Inter",
          "sans-serif",
        ],
      },
      fontWeight: {
        ultralight: "200",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "sun-rotate": "sun-rotate 120s linear infinite",
        "cloud-drift": "cloud-drift 60s linear infinite",
        "rain-fall": "rain-fall 1.2s linear infinite",
        "siren-pulse": "siren-pulse 1.4s ease-in-out infinite",
        "shimmer": "shimmer 2.4s linear infinite",
      },
      keyframes: {
        "sun-rotate": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "cloud-drift": {
          "0%": { transform: "translateX(-30%)" },
          "100%": { transform: "translateX(130%)" },
        },
        "rain-fall": {
          "0%": { transform: "translateY(-20%)", opacity: "0" },
          "20%": { opacity: "0.8" },
          "100%": { transform: "translateY(120%)", opacity: "0" },
        },
        "siren-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(255, 68, 68, 0.55)" },
          "50%": { boxShadow: "0 0 0 18px rgba(255, 68, 68, 0)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
