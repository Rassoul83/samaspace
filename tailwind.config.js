/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        nuit: {
          DEFAULT: "#14213D",
          50: "#EBEDF3",
          100: "#D2D7E4",
          400: "#3D4E7A",
          600: "#1C2C52",
          800: "#0F1830",
          900: "#0A1122",
        },
        sable: {
          DEFAULT: "#F6F1E7",
          100: "#FBF8F2",
          200: "#EFE7D6",
        },
        ocre: {
          DEFAULT: "#E8A33D",
          400: "#F0B863",
          600: "#C9852A",
        },
        atlan: {
          DEFAULT: "#0F6E6E",
          100: "#DCEEEC",
          600: "#0B5555",
        },
        encre: "#1B1B1F",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        sans: ["'General Sans'", "'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "10px",
        lg: "16px",
      },
    },
  },
  plugins: [],
};
