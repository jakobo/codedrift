import { BreakpointProvider } from "~/hooks/useBreakpoints";
import { ThemeProvider } from "emotion-theming";
import React, { createFactory } from "react";
import theme from "~/style/theme";

const breakpoints = {
  xs: "(max-width: 767px)",
  sm: "(min-width: 768px)",
  md: "(min-width: 991px)",
  lg: `(min-width: 1199px)`,
  xl: `(min-width: ${theme.maxWidth})`,
  portrait: "(orientation: portrait)",
  landscape: "(orientation: landscape)",
};

// from https://github.com/acdlite/recompose/blob/master/src/packages/recompose/nest.js
// with so many providers, this was getting difficult to follow
// we instead use a reduceRight to collapse the providers and configurations down
// this will be a bad idea if we ever need to pass a hook into a provider
const getDisplayName = Component => {
  if (typeof Component === "string") return Component;
  if (!Component) return undefined;
  return Component.displayName || Component.name || "Component";
};

const nest = (...args) => {
  const Components = args.map(c => {
    const Component = Array.isArray(c) ? c[0] : c;
    const props = Array.isArray(c) ? c[1] || {} : {};
    const Returned = ({ children }) => {
      // eslint-disable-next-line react/no-children-prop
      return React.createElement(Component, { ...props, children });
    };
    Returned.displayName = getDisplayName(Component);
    return Returned;
  });

  const factories = Components.map(createFactory);
  const Nest = ({ children }) =>
    factories.reduceRight((child, factory) => factory({}, child), children);
  if (process.env.NODE_ENV !== "production") {
    const displayNames = Components.map(getDisplayName);
    Nest.displayName = `nest(${displayNames.join(", ")})`;
  }
  return Nest;
};

/**
 * Define all of your providers. They will be nested within one another. If the item
 * is an Array, then [0] is the provider and [1] is an object that will be passed
 * to the provider as properties
 */
const AllProviders = nest(
  [ThemeProvider, { theme }],
  [BreakpointProvider, { queries: breakpoints }]
);

export default AllProviders;
