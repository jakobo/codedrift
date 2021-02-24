import React, { forwardRef } from "react";
import NextLink from "next/link";
import NextImage from "next/image";
import { Text, Heading, Box, Link } from "theme-ui";

/**
 * About these React Objects
 * To create parity between remark/rehype/react and Theme-UI, we
 * are co-opting the `styles.*` namespace reserved for MDX. Since
 * MDX is ultimately markdown, these should be forward compatible.
 * Using these classes for typography on the site also ensures
 * consistency in content
 */
const createElement = (Component, as, variant) => {
  const el = forwardRef((props, ref) => (
    <Component
      as={as}
      ref={ref}
      {...props}
      variant={props.variant || variant}
    />
  ));
  el.displayName = as;
  return el;
};

export const H1 = createElement(Heading, "h1", "styles.h1");
export const H2 = createElement(Heading, "h2", "styles.h2");
export const H3 = createElement(Heading, "h3", "styles.h3");
export const H4 = createElement(Heading, "h4", "styles.h4");
export const H5 = createElement(Heading, "h5", "styles.h5");
export const H6 = createElement(Heading, "h6", "styles.h6");

export const P = createElement(Text, "p", "styles.p");
export const UL = createElement(Box, "ul", "styles.ul");
export const OL = createElement(Box, "ol", "styles.ol");
export const LI = createElement(Box, "li", "styles.li");

// custom A tag
export const A = forwardRef(({ href, ...props }, ref) => (
  <NextLink href={href} passHref>
    <Link ref={ref} {...props} variant={props.variant || "styles.a"} />
  </NextLink>
));
A.displayName = "a";
