import type { Config } from "tailwindcss";
import daisyui from "daisyui";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      transitionProperty: {
        spacing: "margin, padding",
      },
      animation: {
        drag: "drag 0.3s ease-in-out",
      },
      keyframes: {
        drag: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.02)" },
        },
      },
      zIndex: {
        "60": "60",
        "70": "70",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light","dark"],
  },
};
export default config;
