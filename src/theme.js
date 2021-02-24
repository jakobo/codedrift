import { css, keyframes } from "@emotion/react";
import Head from "next/head";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

const SPACES = [0, 1, 2, 4, 8, 16, 32, 48, 56, 64].map((v) => v * BASELINE);
SPACES.half = 0.5 * BASELINE; // used to add a top + bottom space to uncramp items
SPACES.content = "42em";
SPACES.portable = SPACES[5];
SPACES.portrait = SPACES[6];
SPACES.landscape = SPACES[8];
SPACES.MAX_CONTENT_WIDTH = SPACES.landscape; // over this size, give up and center

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
  breakpoints: ["501px", "1024px", "1025px"],
  // breakpoints: [
  //   SPACES.portable,
  //   SPACES.portrait,
  //   SPACES.landscape,
  //   SPACES.landscape + 1,
  // ].map((s) => `${s}px`),
  space: SPACES,
  sizes: SPACES,
  useColorSchemeMediaQuery: true,
  colors: {
    text: "#212529",
    background: "rgb(240,240,245)",
    secondary: "gray.900",
    primary: "rgb(70,85,70)",
    // accent: "rgb(270, 75, 75)",
    highlight: "rgb(183, 226, 216)",
    muted: GRAYS.regular["600"],
    gray: GRAYS.regular,
    modes: {
      dark: {
        text: "rgb(240,240,240)",
        background: "#151a15",
        primary: "#e2f201",
        secondary: "gray.900",
        muted: GRAYS.inverted["400"],
        gray: GRAYS.inverted,
      },
    },
  },
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
      fontSize: [2, null, 3],
      lineHeight: [2, null, 3],
    },
    h2: {
      fontFamily: "heading",
      fontWeight: "heading",
      letterSpacing: "heading",
      fontSize: [1, null, 2],
      lineHeight: [1, null, 2],
      pt: 1,
      pb: 1,
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
  ...(opts.fonts
    ? {
        fonts: {
          body: `"Whitney SSm A", "Whitney SSm B"`,
          tag: `"Whitney SSm Small Caps A", "Whitney SSm Small Caps B"`,
          heading: `"Sentinel SSm A", "Sentinel SSm B"`,
          mono: `"Operator Mono SSm A", "Operator Mono SSm B"`,
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
          black: 800,
        },
      }
    : {
        fonts: {
          body: "Sans-Serif",
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
      }),
  elevations: [
    `0 0 1px ${borderShadowColor}`,
    `0 0 1px ${borderShadowColor}, 0 2px 4px -2px ${blurryShadowColor}`,
    `0 0 1px ${borderShadowColor}, 0 5px 8px -4px ${blurryShadowColor}`,
    `0 0 1px ${borderShadowColor}, 0 8px 10px -4px ${blurryShadowColor}`,
    `0 0 1px ${borderShadowColor}, 0 16px 24px -8px ${blurryShadowColor}`,
  ],
  links: {
    // nav etc
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
  },
  text: {
    default: {
      fontFamily: "body",
      fontWeight: "body",
      letterSpacing: "body",
      lineHeight: 1,
      fontSize: 1,
    },
    tag: {
      fontFamily: "tag",
      fontWeight: "bold",
      color: "muted",
      // fontVariant: "small-caps", automatically implied by typography.com
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

export const Provider = ({ children }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const fontList = [
    "Whitney SSm A",
    "Whitney SSm B",
    "Sentinel SSm A",
    "Sentinel SSm B",
    "Operator Mono SSm A",
    "Operator Mono SSm B",
  ];

  useEffect(() => {
    const promises = [];
    fontList.forEach((f) => {
      promises.push(new FontFaceObserver(f).load());
    });

    Promise.allSettled(promises).then(() => {
      // console.log("fonts loaded", all);
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
