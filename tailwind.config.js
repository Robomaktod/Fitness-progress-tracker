/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        dark: {
          100: "#252525",
          200: "#252525",
        },
        active: "#e0e0e0",
        auth:{
          
        }
      },
    },
    keyframes: {
      wiggle: {
        "0%": {
           transform: "rotate(-30deg)" 

          },
        "100%": { transform: "rotate(0deg)" },
      },
    },
    animation: {
      wiggle: "wiggle 1s ease-in-out", 
      fadeIn: "fadeIn 0.5s ease-out",
    },
  },
  plugins: [],
};
