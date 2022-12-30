const colors = require("tailwindcss/colors");

// escape an SVG string into a data URI
const toDataUri = (s) =>
  [
    `url('data:image/svg+xml,`,
    s
      .trim()
      .replace(/[\s\r\n]+/gm, " ")
      .replace(/>[\s]*</g, "><")
      .replace(/"/g, "%22")
      .replace(/</g, "%3C")
      .replace(/>/g, "%3E")
      .replace(/#/g, "%23"),
    `')`,
  ].join("");

const TILE_W = 2048;
const TILE_H = 500;

// https://tympanus.net/codrops/2019/02/19/svg-filter-effects-creating-texture-with-feturbulence/
const paper = (color) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${TILE_W}" height="${TILE_H}" viewBox="1 1 ${
    TILE_W + 1
  } ${TILE_H + 1}">
      <filter id="roughpaper" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.02" result="noise" numOctaves="4" />
        <feDiffuseLighting in="noise" lighting-color="${color}" surfaceScale="2">
          <feDistantLight azimuth="45" elevation="60" />
        </feDiffuseLighting>
      </filter>
      <rect x="0" y="0" width="100%" height="100%" filter="url(#roughpaper)" fill="none" opacity="0.2" />
    </svg>
  `;
  return toDataUri(svg);
};

const leather = (color) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${TILE_W}" height="${TILE_H}" viewBox="1 1 ${
    TILE_W + 1
  } ${TILE_H}">
      <filter id="leather" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.24" result="noise" numOctaves="5" />
        <feDiffuseLighting in="noise" lighting-color="${color}" surfaceScale="2">
          <feDistantLight azimuth="45" elevation="20" />
        </feDiffuseLighting>
      </filter>
      <rect x="0" y="0" width="100%" height="100%" filter="url(#leather)" fill="none" opacity="0.08" />
    </svg>
  `;
  return toDataUri(svg);
};

module.exports = {
  important: true, // https://github.com/tailwindlabs/tailwindcss-typography/issues/26#issuecomment-659362241
  content: [
    "./*.ts",
    "./components/*.tsx",
    "./components/**/*.tsx",
    "./data/*.ts",
    "./lib/*.tsx",
    "./lib/**/*.tsx",
    "./pages/*.tsx",
    "./pages/**/*.tsx",
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
        // I like tailwind syntax. Plus, this is cooler than black/white + alpha textures
        "paper-stone-50": paper(colors.stone["50"]),
        "paper-stone-100": paper(colors.stone["100"]),
        "paper-stone-200": paper(colors.stone["200"]),
        "paper-stone-300": paper(colors.stone["300"]),
        "paper-stone-400": paper(colors.stone["400"]),
        "paper-stone-500": paper(colors.stone["500"]),
        "paper-stone-600": paper(colors.stone["600"]),
        "paper-stone-700": paper(colors.stone["700"]),
        "paper-stone-800": paper(colors.stone["800"]),
        "paper-stone-900": paper(colors.stone["900"]),
        "leather-stone-50": leather(colors.stone["50"]),
        "leather-stone-100": leather(colors.stone["100"]),
        "leather-stone-200": leather(colors.stone["200"]),
        "leather-stone-300": leather(colors.stone["300"]),
        "leather-stone-400": leather(colors.stone["400"]),
        "leather-stone-500": leather(colors.stone["500"]),
        "leather-stone-600": leather(colors.stone["600"]),
        "leather-stone-700": leather(colors.stone["700"]),
        "leather-stone-800": leather(colors.stone["800"]),
        "leather-stone-900": leather(colors.stone["900"]),
      },
      maxWidth: {
        limit: "52rem",
      },
    },
  },
  variants: {
    typography: ["dark"],
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("tailwind-children"),
  ],
};
