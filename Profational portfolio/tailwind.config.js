/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class", '[class~="dark"]'],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "var(--ink)",
          surface: "var(--ink-surface)",
          raised: "var(--ink-raised)",
          line: "var(--ink-line)",
        },
        lime: {
          DEFAULT: "#A8CC32",
          dim: "#8AAA28",
        },
        teal: {
          DEFAULT: "#0D9488",
          dim: "#0A766C",
        },
        ivory: {
          DEFAULT: "var(--ivory)",
          muted: "var(--ivory-muted)",
          faint: "var(--ivory-faint)",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        "lime-glow": "0 0 40px rgba(168, 204, 50, 0.25)",
        "teal-glow": "0 0 40px rgba(13, 148, 136, 0.25)",
      },
    },
  },
  plugins: [],
};
