import animate from "tailwindcss-animate";
export default {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: {
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      card: "hsl(var(--card))",
      primary: "hsl(var(--primary))",
      muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted))" },
      border: "hsl(var(--border))"
    },
    fontFamily: { sans: ["Inter", "system-ui", "sans-serif"], display: ["Georgia", "serif"] },
    boxShadow: { glow: "0 0 42px rgba(132,125,255,.18)" }
  }},
  plugins: [animate]
};
