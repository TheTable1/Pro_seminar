/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust this path based on your project structure
  ],
  theme: {
    extend: {
      colors: {
        "dark-brown": "#20170E",
        brown: "#4e3629",
        "light-brown": "#7a5647",
        beige: "#FFE2B4",
      },
    },
    screens: {
      lg: "1024px",
      md: "768px",
      sm: "640px",
    },
  },
  plugins: [],
};
