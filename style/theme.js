import { css, keyframes } from "@emotion/core";

const ANIMATION_TIME = 0.42;

const fadeIn = keyframes`
  from {
    opacity: 0
  }
  to {
    opacity: 1
  }
`;

const fadeOut = keyframes`
  from {
    opacity:1
  }
  to {
    opacity: 0
  }
`;

const enterSlideLeft = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

const exitSlideRight = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
`;

const theme = {
  fontSizes: [8, 12, 16, 24, 32, 48, 64, 96, 128, 256],
  space: [
    // margin and padding
    4,
    8,
    16,
    24,
    32,
    40,
    48,
    64,
    128,
    256,
  ],
  maxWidth: "1152px",
  colors: {
    accent: "#ed2224",
    primary: "#45a6dd",
    green: "#0fa573",
    pine: "#0a6955",
    olive: "#364a4c",
    blue: "#0074e8",
    navy: "#004b91",
    midnight: "#133a5e",
    purple: "#b469eb",
    orchid: "#8046a5",
    eggplant: "#5b2677",
    maroon: "#6e0f3c",
    watermelon: "#f13535",
    orange: "#e3780c",
    darkGray: "#4d4d4d",
    gray: "#8e8e8e",
    lightGray: "#efefef",
    red: "#e60023",
    white: "#fff",
    lightWash: "#e2e2e2",
    darkWash: "#dadada",
  },
  animations: {
    fadeIn: css`
      opacity: 0;
      will-change: opacity;
      animation: ${fadeIn} ${ANIMATION_TIME}s ease-out forwards;
    `,
    fadeOut: css`
      opacity: 1;
      will-change: opacity;
      animation: ${fadeOut} ${ANIMATION_TIME}s ease-out forwards;
    `,
    enterSlideLeft: css`
      transform: translateX(100%);
      will-change: transform;
      animation: ${enterSlideLeft} ${ANIMATION_TIME}s ease-out forwards,
        ${fadeIn} ${ANIMATION_TIME}s ease-out forwards;
    `,
    exitSlideRight: css`
      transform: translateX(0);
      will-change: transform;
      animation: ${exitSlideRight} ${ANIMATION_TIME}s ease-out forwards,
        ${fadeOut} ${ANIMATION_TIME}s ease-out forwards;
    `,
  },
};

export default theme;
