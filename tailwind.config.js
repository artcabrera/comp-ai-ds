/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "apple-text": ["SF Pro Text", "sans-serif"],
        "apple-display": ["SF Pro Display", "sans-serif"],
      },
      scale: {
        "-1": "-1",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
