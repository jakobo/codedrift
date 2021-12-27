module.exports = {
  important: true, // https://github.com/tailwindlabs/tailwindcss-typography/issues/26#issuecomment-659362241
  purge: [
    "./src/components/**/*.tsx",
    "./src/pages/*.tsx",
    "./src/pages/**/*.tsx",
  ],
  darkMode: "class", // or 'media' or false
  theme: {
    extend: {
      colors: {
        light: "#ffffff",
        dark: "#151a15",
        brand: {
          500: "#128458",
          700: "#0b4f35",
        },
        "brand-invert": {
          500: "#e2f201",
          700: "#6d7401",
        },
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
            code: {
              color: theme("colors.light"),
            },
            strong: {
              color: theme("colors.light"),
            },
            em: {
              color: theme("colors.light"),
            },
            blockquote: {
              color: theme("colors.light"),
            },
            h1: {
              color: theme("colors.light"),
            },
            h2: {
              color: theme("colors.light"),
            },
            h3: {
              color: theme("colors.light"),
            },
            h4: {
              color: theme("colors.light"),
            },
            h5: {
              color: theme("colors.light"),
            },
            h6: {
              color: theme("colors.light"),
            },
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
    extend: {
      margin: ["even", "odd"],
      padding: ["even", "odd"],
    },
    typography: ["dark"],
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};
