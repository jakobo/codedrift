import { ThemeProvider } from "theme-ui";
import { useFoutValue } from "./hooks/useFout";
import FontFaceObserver from "fontfaceobserver";
import Head from "next/head";
import React, { useEffect, useMemo, useState } from "react";

// Dear future self
// this is why you wanted to use tailwind...

/**
 * Remaining Tasks
 * [ ] Make the H&Co fonts load even faster, utlilizing the media toggle from
 *     https://csswizardry.com/2019/08/making-cloud-typography-faster/
 */

const borderShadowColor = `rgba(67, 90, 111, 0.3)`;
const blurryShadowColor = `rgba(67, 90, 111, 0.47)`;

// Vert Ryth @ 28
const BASE_FONT = 16;
export const BASELINE = 24;
const RATIO = 1.414;

const FONT_SIZES = [0, 0, 1, 2, 3, 4, 5, 6].map((n) =>
  Math.round(BASE_FONT * RATIO ** n)
);
FONT_SIZES[0] = 12; // special specific small size at position 0, outside of ratio

const fontAt = (sz) => ({
  fontSize: `${sz}px`,
  lineHeight: (Math.ceil(sz / BASELINE) * BASELINE) / sz,
});

/**
 * So something that's super frustrating about Theme-UI is that letterSpacing is
 * assumed to be universal across all font sizes. That's simply false. As fonts
 * get smaller, they need more room to breathe. As a result, we need more complex
 * font size/spacing information than the default theme object provides. For each
 * font object, we also identify a "fallback" property we will use until the
 * proper fonts are loaded. The goal is to minmize visual shift, not replicate
 * an approximate font when we encounter a FOUT.
 */
export const hcoDefinitions = {
  Operator: {
    any: {
      fontFamily: `"Operator SSm A", "Operator SSm B"`,
      ...fontAt(16),
      letterSpacing: 0,
      fontWeight: 500,
      fallback: {
        fontFamily: `Helvetica, sans-serif`,
        lineHeight: 1.35,
        fontWeight: 900,
        letterSpacing: "-0.04em",
        wordSpacing: "0.07em",
      },
    },
  },
  OperatorMono: {
    any: {
      fontFamily: `"Operator Mono SSm A", "Operator Mono SSm B"`,
      ...fontAt(16),
      letterSpacing: 0,
      fontWeight: 400,
      fallback: {
        fontFamily: `"Courier New", monospace`,
        letterSpacing: "0.03em",
        wordSpacing: "-0.03em",
      },
    },
  },
  IdealSans: {
    small: {
      fontFamily: `"Ideal Sans SSm A", "Ideal Sans SSm B"`,
      ...fontAt(14),
      letterSpacing: 0,
      fontWeight: 300,
      fallback: {
        fontFamily: `Helvetica, system-ui, Sans-Serif`,
        letterSpacing: "0.01em",
        wordSpacing: "0.08em",
      },
    },
    medium: {
      fontFamily: `"Ideal Sans SSm A", "Ideal Sans SSm B"`,
      ...fontAt(16),
      fontWeight: 300,
      letterSpacing: 0,
      fallback: {
        fontFamily: `Helvetica, system-ui, Sans-Serif`,
        letterSpacing: "0.02em",
        wordSpacing: "0.08em",
      },
    },
    large: {
      fontFamily: `"Ideal Sans SSm A", "Ideal Sans SSm B"`,
      ...fontAt(28),
      fontWeight: 300,
      letterSpacing: 0,
      fallback: {
        fontFamily: `Helvetica, system-ui, Sans-Serif`,
        letterSpacing: "0.01em",
        wordSpacing: "0.14em",
      },
    },
  },
  IdealSansHeadlines: {
    tiny: {
      fontFamily: `"Ideal Sans SSm A", "Ideal Sans SSm B"`,
      ...fontAt(16),
      fontWeight: 600,
      letterSpacing: 0,
      fallback: {
        fontFamily: `Helvetica, system-ui, Sans-Serif`,
        letterSpacing: "0.02em",
        wordSpacing: "-0.04em",
      },
    },
    small: {
      fontFamily: `"Ideal Sans A", "Ideal Sans B"`,
      ...fontAt(24),
      fontWeight: 400,
      letterSpacing: 0,
      py: "half",
      fallback: {
        fontFamily: `Helvetica, system-ui, Sans-Serif`,
        fontWeight: 600,
        letterSpacing: "-0.06em",
        wordSpacing: "0.07em",
      },
    },
    medium: {
      fontFamily: `"Ideal Sans A", "Ideal Sans B"`,
      ...fontAt(36),
      fontWeight: 500,
      letterSpacing: "-0.01em",
      fallback: {
        fontFamily: `Helvetica, system-ui, Sans-Serif`,
        lineHeight: 1.36,
        fontWeight: 600,
        letterSpacing: "-0.09em",
        wordSpacing: "0.22em",
      },
    },
    large: {
      fontFamily: `"Ideal Sans A", "Ideal Sans B"`,
      ...fontAt(64),
      fontWeight: 600,
      letterSpacing: "-0.04em",
      fallback: {
        fontFamily: `Helvetica, system-ui, Sans-Serif`,
        letterSpacing: "-0.08em",
        wordSpacing: "0.01em",
      },
    },
  },
  IdealSansTags: {
    medium: {
      fontFamily: `"Ideal Sans SSm Small Caps A", "Ideal Sans SSm Small Caps B"`,
      ...fontAt(16),
      fontWeight: 400,
      letterSpacing: 0,
      fallback: {
        fontFamily: `"Helvetica, system-ui, Sans-Serif"`,
        fontVariant: "small-caps",
        fontSize: "17px",
        lineHeight: 1.42,
        letterSpacing: "-0.01em",
        wordSpacing: "0.23em",
      },
    },
  },
};

// our spaces are based on the baseline value, allowing for partial spacing when we need
// something to feel vertically centered and not resting on the baseline
// we also add several shortcuts for common spacing problems
const SPACES = [0, 1, 2, 4, 8, 16, 32, 48, 56, 64].map(
  (v) => `${v * BASELINE}px`
);
SPACES.quarter = 0.25 * BASELINE; // usually for tightly coupled objects that are non-textual
SPACES.half = 0.5 * BASELINE; // often used to pad the top & bottom of something to "center" it in the baseline
SPACES.reading = "42em"; // a comfortable reading width
SPACES.margin = "9em"; // when I want to "bleed" off the left column
SPACES.negativeMargin = `-${SPACES.margin}`; // a width of margin means a negative margin here
SPACES.portable = SPACES[5]; // mobile and small form factors
SPACES.portrait = `calc(${SPACES.reading}+${SPACES.margin})`; // when do we "snap" margins instead of stack
SPACES.landscape = SPACES[8]; // the largest we really design for
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

// builds our theme object given a variety of options
// (coming from our theme provider, toggles, fonts loader, etc)
const retheme = (opts = {}) => {
  const useFallback = !opts.fonts;

  // build our custom typography object
  const typography = Object.getOwnPropertyNames(hcoDefinitions).reduce(
    (all, id) => {
      const next = Object.getOwnPropertyNames(hcoDefinitions[id]).reduce(
        (sizes, size) => {
          const info = hcoDefinitions[id][size];
          const { fallback, ...rest } = info;
          const result = useFallback ? { ...rest, ...fallback } : { ...rest };
          return { ...sizes, [size]: result };
        },
        {}
      );

      return { ...all, [id]: next };
    },
    {}
  );

  // It's a joke. Kind of. Use a default font, pay a "comical" price
  const avoidThemeUIFonts = {
    fonts: {
      body: `"Comic Sans MS", "Comic Sans", Papyrus, "Marker Felt", cursive`,
      headline: `"Comic Sans MS", "Comic Sans", Papyrus, "Marker Felt", cursive`,
    },
    fontSizes: [0],
  };

  return {
    // growing sizes where we can feasibly add "more things"
    breakpoints: ["501px", "1024px", "1025px"],
    space: SPACES,
    sizes: SPACES,
    ...avoidThemeUIFonts,
    typography,
    useColorSchemeMediaQuery: true,
    colors: {
      text: "#212529",
      background: "#FFF",
      secondary: "gray.900",
      primary: "#128458",
      highlight: "#FFF",
      gray: GRAYS.regular,
      modes: {
        dark: {
          text: "rgb(240,240,240)",
          background: "#151a15",
          primary: "#e2f201",
          highlight: "#151a15",
          secondary: "gray.900",
          gray: GRAYS.inverted,
        },
      },
    },
    // these styles are common for our components, markdown, and more
    styles: {
      root: {
        fontSize: "16px",
        lineHeight: 1,
      },
      a: {
        color: "primary",
        textDecoration: "none",
        borderBottomWidth: "1px",
        borderBottomColor: "primary",
        borderBottomStyle: "dotted",
        "&:hover": {
          borderBottomStyle: "solid",
          filter: "brightness(0.7)",
        },
      },
      h1: {
        ...typography.IdealSansHeadlines.large,
      },
      h2: {
        ...typography.IdealSansHeadlines.medium,
      },
      h3: {
        ...typography.IdealSansHeadlines.small,
      },
      h4: {
        ...typography.IdealSansHeadlines.small,
      },
      h5: {
        ...typography.IdealSansHeadlines.small,
      },
      h6: {
        ...typography.IdealSansHeadlines.small,
      },
      p: {
        ...typography.IdealSans.medium,
        pb: 1,
      },
      code: {
        ...typography.Operator.any,
        display: "inline",
      },
      blockquote: {
        display: "block",
        ...typography.IdealSans.medium,
        fontStyle: "italic",
        ml: "half",
        pl: "half",
        borderLeftWidth: "1px",
        borderLeftColor: "primary",
        borderLeftStyle: "solid",
        mr: 1,
        mb: 1,
      },
      ul: {
        display: "block",
        pb: 1,
        listStyleType: "circle",
        ml: "3em",
      },
      ol: {
        display: "block",
        pb: 1,
        listStyleType: "decimal",
        ml: "3em",
      },
      li: {
        // maintains parent size (use a paragraph inside if you want something else)
        ...typography.IdealSans.medium,
        py: "half",
      },
    },
    elevations: [
      `0 0 1px ${borderShadowColor}`,
      `0 0 1px ${borderShadowColor}, 0 2px 4px -2px ${blurryShadowColor}`,
      `0 0 1px ${borderShadowColor}, 0 5px 8px -4px ${blurryShadowColor}`,
      `0 0 1px ${borderShadowColor}, 0 8px 10px -4px ${blurryShadowColor}`,
      `0 0 1px ${borderShadowColor}, 0 16px 24px -8px ${blurryShadowColor}`,
    ],
    // <button>
    buttons: {
      primary: {
        px: 1,
        py: "half",
      },
    },
    // introduced when using the <Link> element directly
    links: {
      category: {
        variant: "styles.a",
        ...typography.IdealSansTags.medium,
        border: 0,
        "&:hover": {
          border: 0,
        },
      },
      nav: {
        ...typography.IdealSans.medium,
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
        ...typography.IdealSans.medium,
      },
      tag: {
        ...typography.IdealSansTags.medium,
      },
      lead: {
        ...typography.IdealSansTags.medium,
        color: "gray.500",
      },
      nav: {
        ...typography.IdealSans.medium,
      },
      typography,
    },
  };
};

// A unique list of every font we must ensure is loaded
// programtic. because lazy. the engineering kind of lazy
const fontLoadingList = [
  ...new Set(
    Object.getOwnPropertyNames(hcoDefinitions).reduce((fonts, font) => {
      const next = Object.getOwnPropertyNames(hcoDefinitions[font]).reduce(
        (variants, variant) => {
          const def = hcoDefinitions[font][variant];
          const f = (def.fontFamily || "")
            .split(",")
            .map((f) => f.replace(/['"]/g, "").trim());
          return [...variants, ...f];
        },
        []
      );

      return [...fonts, ...next];
    }, [])
  ),
];

export const Provider = ({ children }) => {
  const foutLoaded = useFoutValue();
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
      fonts: foutLoaded && fontsLoaded,
    });
  }, [foutLoaded, fontsLoaded]);

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
