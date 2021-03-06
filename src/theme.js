import Head from "next/head";
import React, { useEffect, useMemo, useState } from "react";
import { ThemeProvider } from "theme-ui";
import FontFaceObserver from "fontfaceobserver";

const borderShadowColor = `rgba(67, 90, 111, 0.3)`;
const blurryShadowColor = `rgba(67, 90, 111, 0.47)`;

// Vert Ryth @ 24
const BASE_FONT = 16;
const BASE_LINE_HEIGHT = 1.5;
export const BASELINE = BASE_FONT * BASE_LINE_HEIGHT;
const RATIO = 1.414;

const FONT_SIZES = [-1, 0, 1, 2, 3, 4, 5, 6].map((n) =>
  Math.round(BASE_FONT * RATIO ** n)
);
const LINE_HEIGHTS = FONT_SIZES.map(
  (f) => (Math.ceil(f / BASELINE) * BASELINE) / f
);

// these are the H&Co fonts we're using
const hCoFonts = {
  fonts: {
    body: `"Whitney SSm A", "Whitney SSm B"`,
    tag: `"Whitney SSm Small Caps A", "Whitney SSm Small Caps B"`,
    heading: `"Verlag A", "Verlag B"`,
    mono: `"Operator Mono SSm A", "Operator Mono SSm B"`,
  },
  fontSizes: FONT_SIZES,
  lineHeights: LINE_HEIGHTS,
  letterSpacings: {
    body: 0,
    heading: 0,
  },
  fontWeights: {
    body: 500,
    heading: 700,
    bold: 700,
    black: 800,
  },
};

// these are the fallbacks for the FOUT we expect
const fallbackFonts = {
  fonts: {
    body: "Helvetica, system-ui, Sans-Serif",
    heading: `"Times New Roman", Times, Serif`,
    mono: `"Courier New", Courer, Monpspace`,
  },
  fontSizes: FONT_SIZES,
  lineHeights: LINE_HEIGHTS,
  letterSpacings: {
    body: 0,
    heading: 0,
  },
  fontWeights: {
    body: 300,
    heading: 700,
    bold: 700,
    black: 900,
  },
};

// our spaces are based on the baseline value, allowing for partial spacing when we need
// something to feel vertically centered and not resting on the baseline
const SPACES = [0, 1, 2, 4, 8, 16, 32, 48, 56, 64].map((v) => v * BASELINE);
SPACES.quarter = 0.25 * BASELINE; // aesthetic. probably remove
SPACES.half = 0.5 * BASELINE;
SPACES.content = "42em";
SPACES.portable = SPACES[5];
SPACES.portrait = SPACES[6];
SPACES.landscape = SPACES[8];
SPACES.MAX_CONTENT_WIDTH = SPACES.landscape; // over this size, give up and center

// our grayscale exists both normal and inverted for dark mode
const GRAYSCALE = [
  "#f8f9fa",
  "#e9ecef",
  "#dee2e6",
  "#ced4da",
  "#adb5bd",
  "#6c757d",
  "#495057",
  "#343a40",
  "#212529",
];
const GRAYS = {
  regular: GRAYSCALE.reduce(
    (a, c, i) => ({
      ...a,
      [`${(i + 1) * 100}`]: c,
    }),
    {}
  ),
  inverted: GRAYSCALE.reverse().reduce(
    (a, c, i) => ({
      ...a,
      [`${(i + 1) * 100}`]: c,
    }),
    {}
  ),
};

const retheme = (opts = {}) => ({
  // growing sizes where we can feasibly add "more things"
  breakpoints: ["501px", "1024px", "1025px"],
  space: SPACES,
  sizes: SPACES,
  useColorSchemeMediaQuery: true,
  colors: {
    text: "#212529",
    background: "#FFF",
    secondary: "gray.900",
    primary: "rgb(70,85,70)",
    highlight: "rgb(183, 226, 216)",
    gray: GRAYS.regular,
    modes: {
      dark: {
        text: "rgb(240,240,240)",
        background: "#151a15",
        primary: "#e2f201",
        secondary: "gray.900",
        gray: GRAYS.inverted,
      },
    },
  },
  // these styles are common for our components, markdown, and more
  styles: {
    root: {
      fontSize: 1,
      lineHeight: 1,
      fontFamily: "body",
      fontWeight: "body",
    },
    a: {
      color: "primary",
      fontWeight: "bold",
      textDecoration: "none",
      borderBottomWidth: "1px",
      borderBottomColor: "primary",
      borderBottomStyle: "dashed",
      "&:hover": {
        borderBottomStyle: "solid",
      },
    },
    h1: {
      fontFamily: "heading",
      fontWeight: "heading",
      letterSpacing: "heading",
      fontSize: [3, null, 4],
      lineHeight: [3, null, 4],
    },
    h2: {
      fontFamily: "heading",
      fontWeight: "heading",
      letterSpacing: "heading",
      fontSize: [2, null, 3],
      lineHeight: [2, null, 3],
      py: "half",
    },
    h3: {
      fontFamily: "heading",
      fontWeight: "heading",
      letterSpacing: "heading",
      fontSize: [1, null, 2],
      lineHeight: [1, null, 2],
      py: [0, null, "half"],
    },
    p: {
      fontFamily: "body",
      fontWeight: "body",
      letterSpacing: "body",
      fontSize: 1,
      lineHeight: 1,
      pb: 1,
    },
    ul: {
      pb: 1,
      listStyleType: "circle",
      ml: "3em",
    },
    ol: {
      pb: 1,
      listStyleType: "decimal",
      ml: "3em",
    },
  },
  ...(opts.fonts ? hCoFonts : fallbackFonts),
  elevations: [
    `0 0 1px ${borderShadowColor}`,
    `0 0 1px ${borderShadowColor}, 0 2px 4px -2px ${blurryShadowColor}`,
    `0 0 1px ${borderShadowColor}, 0 5px 8px -4px ${blurryShadowColor}`,
    `0 0 1px ${borderShadowColor}, 0 8px 10px -4px ${blurryShadowColor}`,
    `0 0 1px ${borderShadowColor}, 0 16px 24px -8px ${blurryShadowColor}`,
  ],
  // introduced when using the <Link> element directly
  links: {
    category: {
      variant: "styles.a",
      fontFamily: "tag",
      fontWeight: "bold",
      fontSize: 1,
      lineHeight: 1,
      border: 0,
      "&:hover": {
        border: 0,
      },
    },
    nav: {
      fontFamily: "body",
      fontSize: 1,
      lineHeight: 1,
      border: 0,
      color: "gray.600",
      textDecoration: "none",
      "&:hover": {
        color: "primary",
      },
    },
  },
  // introduced when using the <Text> element directly
  text: {
    default: {
      fontFamily: "body",
      fontWeight: "body",
      letterSpacing: "body",
      lineHeight: 1,
      fontSize: 1,
    },
    lead: {
      fontFamily: "tag",
      fontWeight: "bold",
      letterSpacing: "tag",
      lineHeight: 1,
      fontSize: 1,
      color: "gray.400",
    },
    aside: {
      fontFamily: "tag",
      fontWeight: "bold",
      color: "gray.700",
      fontSize: 1,
      lineHeight: 1,
    },
    nav: {
      fontFamily: "body",
      fontSize: 0,
      lineHeight: 0,
    },
  },
});

const fontLoadingList = Object.getOwnPropertyNames(hCoFonts.fonts).reduce(
  (curr, key) => {
    const fonts = hCoFonts.fonts[key]
      .split(",")
      .map((f) => f.replace(/['"]/g, "").trim());
    curr.push(...fonts);
    return curr;
  },
  []
);
console.log(fontLoadingList);
export const Provider = ({ children }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  useEffect(() => {
    const promises = [];
    fontLoadingList.forEach((f) => {
      promises.push(new FontFaceObserver(f).load());
    });

    Promise.allSettled(promises).then(() => {
      setFontsLoaded(true);
    });
  }, []);

  const themeObject = useMemo(() => {
    return retheme({
      fonts: fontsLoaded,
    });
  }, [fontsLoaded]);

  // TODO: https://csswizardry.com/2019/08/making-cloud-typography-faster/
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cloud.typography.com/7828318/7442832/css/fonts.css"
          media="all"
        />
      </Head>
      <ThemeProvider theme={themeObject}>{children}</ThemeProvider>
    </>
  );
};
