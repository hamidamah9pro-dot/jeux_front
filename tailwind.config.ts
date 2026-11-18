import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#0a0912",
        plum: "#171229",
        ink: "#241c3d",
        hot: "#ff3d8b",
        amber: "#ffb547",
      },
      fontFamily: { display: ["var(--font-display)", "system-ui", "sans-serif"] },
      keyframes: {
        drift: {
          "0%,100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(30px,-24px,0) scale(1.08)" },
        },
        reveal: {
          "0%": { opacity: "0", transform: "translateY(16px) rotate(-1.5deg)" },
          "100%": { opacity: "1", transform: "translateY(0) rotate(0)" },
        },
        pop: {
          "0%": { transform: "scale(.6)", opacity: "0" },
          "70%": { transform: "scale(1.08)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        drift: "drift 14s ease-in-out infinite",
        reveal: "reveal .6s cubic-bezier(.2,.8,.2,1) both",
        pop: "pop .35s cubic-bezier(.2,.8,.2,1) both",
      },
    },
  },
  plugins: [],
};
export default config;
