module.exports = {
  purge: [],
  darkMode: "class", // or 'media' or false
  theme: {
    extend: {
      colors: {
        brand: {
          500: "#128458",
          700: "#0b4f35",
        },
        "brand-invert": {
          500: "#e2f201",
          700: "#6d7401",
        },
        light: "#ffffff",
        dark: "#151a15",
      },
      fontFamily: {
        sans: `"Ideal Sans SSm A", "Ideal Sans SSm B", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
        "sans-lg": `"Ideal Sans A", "Ideal Sans B", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
        "sans-caps": `"Ideal Sans SSm Small Caps A", "Ideal Sans SSm Small Caps B", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
        serif: false,
        mono: `"Operator Mono SSm A", "Operator Mono SSm B", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
        code: `"Operator SSm A", "Operator SSm B", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
      },
      maxWidth: {
        reading: "42rem",
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.dark"),
            a: {
              color: theme("colors.brand.500"),
              borderBottom: `1px dotted ${theme("colors.brand.500")}`,
              textDecoration: "none",
              "&:hover": {
                color: theme("colors.brand.700"),
                borderBottomColor: theme("colors.brand.700"),
              },
            },
          },
        },
        dark: {
          css: {
            color: theme("colors.light"),
            a: {
              color: theme("colors.brand-invert.500"),
              borderBottom: `1px dotted ${theme("colors.brand-invert.500")}`,
              textDecoration: "none",
              "&:hover": {
                color: theme("colors.brand-invert.700"),
                borderBottomColor: theme("colors.brand-invert.700"),
              },
            },
          },
        },
      }),
    },
  },
  variants: {
    extend: {},
    typography: ["dark"],
  },
  plugins: [require("@tailwindcss/typography")],
};
