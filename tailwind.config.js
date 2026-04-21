/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#f4f3ee",
        ink: "#161616",
        mist: "#e7e2d8",
        panel: "#fffdf8",
        pine: "#1f4d3f",
        amber: "#c58a17",
        slate: "#58636e",
      },
      boxShadow: {
        panel: "0 24px 60px rgba(22, 22, 22, 0.08)",
      },
      backgroundImage: {
        grid: "radial-gradient(circle at 1px 1px, rgba(31,77,63,0.12) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};
