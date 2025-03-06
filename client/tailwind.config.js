// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  safelist: [
    { pattern: /hover:bg-light-brown/ },
    { pattern: /hover:text-beige/ },
  ],

  theme: {
    extend: {
      colors: {
        "dark-brown": "#20170E",
        brown: "#4e3629",
        "light-brown": "#7a5647",
        beige: "#FFE2B4",
        "beige-light": "#fff4e2",
        "brown-superlight": "#efdfc3",
      },
    },
    screens: {
      lg: "1024px",
      md: "768px",
      sm: "640px",
    },
  },
};
