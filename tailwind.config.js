const colors = require("tailwindcss/colors");

const tx = (c) => {
  const v = c.replace("#", "%23");
  return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='${v}' fill-opacity='0.5' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`;
};

module.exports = {
  important: true, // https://github.com/tailwindlabs/tailwindcss-typography/issues/26#issuecomment-659362241
  content: [
    "./src/*.ts",
    "./src/components/*.tsx",
    "./src/components/**/*.tsx",
    "./src/pages/*.tsx",
    "./src/pages/**/*.tsx",
  ],
  darkMode: "class", // or 'media' or false
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        black: colors.black,
        white: colors.white,
        primary: colors.emerald,
        secondary: colors.amber,
        gray: colors.stone,
      },
      fontFamily: {
        title: `'Work Sans', sans-serif`,
        sans: `'Open Sans', sans-serif`,
        serif: false,
        mono: `'Roboto Mono', monospace`,
        code: `'Roboto Mono', monospace`,
      },
      backgroundImage: {
        texture: tx(colors.stone["200"]),
        "texture-invert": tx(colors.stone["800"]),
      },
      maxWidth: {
        limit: "52rem",
      },
    },
  },
  variants: {
    typography: ["dark"],
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};
