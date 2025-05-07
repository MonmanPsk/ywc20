import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'y20-gradient': 'linear-gradient(90deg,#f81a64 0,#f52222 50%,#ff691d 86%,#ffb623)',
      },
    },
  },
  plugins: [],
};

export default config;
