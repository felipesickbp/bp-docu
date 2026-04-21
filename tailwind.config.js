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
        canvas: "#f3f6fc",
        ink: "#071a40",
        mist: "#dce3f2",
        panel: "#ffffff",
        pine: "#4a46d4",
        amber: "#7b61ff",
        slate: "#4b5c78",
      },
      boxShadow: {
        panel: "0 30px 80px rgba(7, 26, 64, 0.12)",
      },
      backgroundImage: {
        grid: "radial-gradient(circle at 1px 1px, rgba(74,70,212,0.14) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};
