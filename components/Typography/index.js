import { forwardRef } from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import {
  space,
  fontSize,
  fontWeight,
  fontStyle,
  color,
  textAlign,
} from "styled-system";
import PropTypes from "prop-types";
import NextLink from "next/link";
import qs from "query-string";

// not needed ... yet
// const TALL_LINE_HEIGHT = css`
//   line-height: 1.5;
// `;

const TRUNCATE = css`
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const DEFAULT_TEXT = css`
  font-family: neue-haas-grotesk-display, apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Fira Sans",
    "Droid Sans", "Helvetica Neue", Helvetica, "ヒラギノ角ゴ Pro W3",
    "Hiragino Kaku Gothic Pro", "メイリオ", Meiryo, "ＭＳ Ｐゴシック", Arial,
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  letter-spacing: -0.1px;
  line-height: 1.4;
  hyphens: auto;
  word-wrap: break-word;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
`;

const Type = forwardRef(
  ({ bold = false, light, italic = false, ...rest }, ref) => {
    const weight = light ? 300 : bold ? 700 : 400;
    const fstyle = italic ? "italic" : "normal";
    return (
      <Type.Styled ref={ref} fontWeight={weight} fontStyle={fstyle} {...rest} />
    );
  }
);
Type.propTypes = {
  ...space.propTypes,
  ...fontSize.propTypes,
  ...fontWeight.propTypes,
  ...textAlign.propTypes,
  ...color.propTypes,
  ...fontStyle.propTypes,
};
Type.Styled = styled.span`
  ${space}
  ${fontSize}
  ${fontWeight}
  ${fontStyle}
  ${textAlign}
  ${color}
  ${DEFAULT_TEXT}
`;

const textSizeMap = {
  xs: 0,
  sm: 1,
  md: 2,
  lg: 3,
};
const Text = forwardRef(
  ({ as = "span", size = "md", truncate = false, ...rest }, ref) => (
    <Text.Styled
      ref={ref}
      as={as}
      fontSize={textSizeMap[size] || textSizeMap.md}
      truncate={truncate}
      {...rest}
    />
  )
);
Text.Styled = styled(Type)`
  ${p => (p.truncate ? TRUNCATE : "")}
`;
Text.propTypes = {
  truncate: PropTypes.bool,
  size: PropTypes.oneOf(Object.keys(textSizeMap)),
  ...Type.propTypes,
};

const headingSizeMap = {
  xxl: 6,
  xl: 5,
  lg: 4,
  md: 3,
  sm: 3,
  xs: 1,
};
const Heading = forwardRef(
  ({ as = "h2", size = "lg", truncate = false, ...rest }, ref) => (
    <Heading.Styled
      ref={ref}
      as={as}
      fontSize={headingSizeMap[as] || headingSizeMap.lg}
      truncate={truncate}
      {...rest}
    />
  )
);
Heading.Styled = styled(Type)`
  ${p => (p.truncate ? TRUNCATE : "")}
`;
Heading.propTypes = {
  truncate: PropTypes.bool,
  size: PropTypes.oneOf(Object.keys(headingSizeMap)),
  ...Type.propTypes,
};

const pSizeMap = {
  sm: 1,
  md: 2,
  lg: 3,
};
const Paragraph = forwardRef(({ size = "md", ...rest }, ref) => (
  <Type
    ref={ref}
    as="p"
    fontSize={pSizeMap[size] || pSizeMap.md}
    marginBottom="1.75rem"
    {...rest}
  />
));
Paragraph.propTypes = {
  ...Type.propTypes,
  size: PropTypes.oneOf(Object.keys(pSizeMap)),
};

const Link = forwardRef((props = {}, ref) => {
  return <Type ref={ref} as="a" {...props} />;
});

export { Link, Type, Heading, Text, Paragraph };
