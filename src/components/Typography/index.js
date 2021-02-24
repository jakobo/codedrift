import {
  color,
  fontSize,
  fontStyle,
  fontWeight,
  space,
  textAlign,
} from "styled-system";
import { css } from "@emotion/react";
import Box from "../Box";
import PropTypes from "prop-types";
import React, { forwardRef } from "react";
import chroma from "chroma-js";
import styled from "@emotion/styled";

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
  letter-spacing: 0.3px;
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
Type.displayName = "Type";
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
Text.displayName = "Text";
Text.Styled = styled(Type)`
  ${(p) => (p.truncate ? TRUNCATE : "")}
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
const headingHMap = {
  h1: "lg",
  h2: "md",
  h3: "sm",
  h4: "xs",
  h5: "xs",
  h6: "xs",
};
const Heading = forwardRef(
  (
    {
      as = "h2",
      size = null,
      id = null,
      includeAnchor = false,
      truncate = false,
      children,
      ...rest
    },
    ref
  ) => {
    size = size
      ? headingSizeMap?.[size] || size
      : headingSizeMap?.[headingHMap?.[as]] || null;
    return (
      <Heading.Styled
        ref={ref}
        as={as}
        fontSize={size}
        truncate={truncate}
        id={id}
        includeAnchor={includeAnchor}
        {...rest}
      >
        {id && includeAnchor && (
          <Box as="span" display="inline-block" marginLeft="-20px" width="20px">
            <a className="anchor" href={`#${id}`} aria-hidden>
              X
            </a>
          </Box>
        )}
        {children}
      </Heading.Styled>
    );
  }
);
Heading.displayName = "Heading";
Heading.Styled = styled(Type)`
  ${(p) => (p.truncate ? TRUNCATE : "")}
  & a.anchor {
    visibility: hidden;
  }
  &:hover a.anchor {
    visibility: visible;
  }
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
Paragraph.displayName = "Paragraph";
Paragraph.propTypes = {
  ...Type.propTypes,
  size: PropTypes.oneOf(Object.keys(pSizeMap)),
};

const Link = forwardRef((props = {}, ref) => {
  return <Link.Styled ref={ref} as="a" color="primary" {...props} />;
});
Link.displayName = "Link";
Link.Styled = styled(Type)`
  &:hover {
    color: ${(p) => chroma(p.theme.colors[p.color]).darken().css()};
  }
`;

export { Link, Type, Heading, Text, Paragraph };
