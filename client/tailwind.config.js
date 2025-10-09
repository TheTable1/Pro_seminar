// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  safelist: ["hover:bg-light-brown", "hover:text-beige"],
  theme: {
    extend: {
      colors: {
        "dark-brown": "#20170E",
        brown: "#4e3629",
        "light-brown": "#7a5647",
        "light-brown2": "rgba(114, 59, 27, 0.55)",
        beige: "#FFE2B4",
        "beige-light": "#fff4e2",
        "brown-superlight": "#efdfc3",
        "brown-light": "rgba(123, 53, 0, 0.1)",
      },
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
    },
  },
};

export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        main: ['"Mainfont"', "system-ui", "sans-serif"], // << เพิ่มอันนี้
      },
    },
  },
  plugins: [],
};
