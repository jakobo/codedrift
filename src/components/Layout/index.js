import { A } from "../markup";
import { Box, Flex, useThemeUI } from "theme-ui";
import { useResponsiveValue } from "@theme-ui/match-media";
import Icon from "../Icon";
import Logo from "../Logo";
import React, { useCallback } from "react";

const LARGE_ONLY = [false, false, true];
const MEDIUM_PLUS = [false, true, true];
const ALL_SIZES = [true, true, true];

const Twitter = () => (
  <A href="https://twitter.com/jakobo" sx={{ borderBottomWidth: 0 }}>
    <Icon
      height="16"
      icon="twitter"
      sx={{ fill: "text", "&:hover": { fill: "primary" } }}
    />
  </A>
);
const GitHub = () => (
  <A href="https://github.com/jakobo" sx={{ borderBottomWidth: 0 }}>
    <Icon
      height="16"
      icon="github"
      sx={{ fill: "text", "&:hover": { fill: "primary" } }}
    />
  </A>
);
const LightSwitch = () => {
  const { colorMode, setColorMode } = useThemeUI();
  const flipLights = useCallback(() => {
    setColorMode((last) => (last === "dark" ? "light" : "dark"));
  }, []);
  return (
    <Box onClick={flipLights} sx={{ cursor: "pointer" }}>
      {colorMode === "light" ? "🌙" : "🔆"}
    </Box>
  );
};

const headerNavigation = [
  {
    sizes: LARGE_ONLY,
    title: "Home",
    url: "/",
  },
  {
    sizes: ALL_SIZES,
    title: "Writing",
    url: "/thunked",
  },
  {
    sizes: ALL_SIZES,
    title: "Notes",
    url: "https://coda.io/d/Jakobs-Notes_dFBvQLDXnR5",
  },
  {
    sizes: LARGE_ONLY,
    title: "Speaking",
    url: "/speaking",
  },
  {
    sizes: MEDIUM_PLUS,
    title: "Aibex",
    url: "https://aibex.com",
  },
  {
    sizes: ALL_SIZES,
    title: "About",
    url: "/about",
  },
];

const headerIcons = [
  {
    sizes: ALL_SIZES,
    name: "twitter",
    Component: Twitter,
  },
  {
    sizes: LARGE_ONLY,
    name: "github",
    Component: GitHub,
  },
  {
    sizes: ALL_SIZES,
    name: "darkmode",
    Component: LightSwitch,
  },
];

const footerNavigation = [
  {
    sizes: ALL_SIZES,
    title: "Top",
    url: "#",
  },
  {
    sizes: ALL_SIZES,
    title: "Home",
    url: "/",
  },
  {
    sizes: ALL_SIZES,
    title: "Writing",
    url: "/thunked",
  },
  {
    sizes: ALL_SIZES,
    title: "About",
    url: "/about",
  },
  {
    sizes: ALL_SIZES,
    title: "Contact",
    url: "/contact",
  },
];

function TitleBar() {
  const navFilter = useResponsiveValue([0, 1, 2]);

  return (
    <Flex sx={{ flexDirection: "column", alignItems: "center" }}>
      <Box
        sx={{
          bg: "gray.200",
          width: "100%",
          height: 1,
          borderBottomStyle: "solid",
          borderBottomColor: "gray.400",
          borderBottomWidth: "1px",
        }}
      >
        {/* todo hamburger here... maybe. Ideally not */}
      </Box>
      <Flex
        sx={{
          pb: 1,
          px: 1,
          flexDirection: "row",
          justifyContent: "center",
          width: "100%",
          maxWidth: "MAX_CONTENT_WIDTH",
        }}
      >
        <Box
          sx={{
            // lovingly set on a 24px baseline
            mt: -1,
            bg: "gray.200",
            px: 1,
            py: "10px",
            borderBottomStyle: "solid",
            borderBottomColor: "primary",
            borderBottomWidth: "4px",
            borderRadius: "4px",
          }}
        >
          <Logo
            left="secondary"
            right="primary"
            text={false}
            sx={{ height: "80px" }}
          />
        </Box>
        <Flex
          sx={{ flexGrow: 1, flexDirection: "row", justifyContent: "flex-end" }}
        >
          {headerNavigation
            .filter((item) => item.sizes[navFilter])
            .map((item, idx) => {
              const first = idx === 0;
              return (
                <Box
                  key={item.url}
                  sx={{
                    ml: first ? 0 : "half",
                  }}
                >
                  <A href={item.url} variant="nav">
                    {item.title}
                  </A>
                </Box>
              );
            })}
          <Flex
            sx={{
              flexDirection: "row",
              ml: "half",
              height: 1,
              alignItems: "center",
            }}
          >
            {headerIcons
              .filter((item) => item.sizes[navFilter])
              .map((item) => {
                // const first = idx === 0;
                const Component = item.Component;
                return (
                  <Box key={item.name} sx={{ ml: "half" }}>
                    <Component />
                  </Box>
                );
              })}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

const Footer = () => {
  const navFilter = useResponsiveValue([0, 1, 2]);
  return (
    <Flex sx={{ flexDirection: "column", alignItems: "center", mt: 2 }}>
      <Box sx={{ bg: "secondary", width: "100%" }}>
        <Flex
          sx={{ flexDirection: "row", pt: 2, pb: 2, justifyContent: "center" }}
        >
          {footerNavigation
            .filter((item) => item.sizes[navFilter])
            .map((item, idx) => {
              const first = idx === 0;
              return (
                <Box key={item.url} sx={{ ml: first ? 0 : "quarter" }}>
                  <A href={item.url} variant="nav.footer">
                    {item.title}
                  </A>
                </Box>
              );
            })}
        </Flex>
      </Box>
    </Flex>
  );
};

export default function Layout({ sx = {}, children }) {
  return (
    <Flex
      sx={{
        flexDirection: "column",
        minHeight: "100vh",
        minWidth: "100%",
        maxWidth: "100%",
      }}
    >
      <TitleBar />
      <Flex
        sx={{
          flexGrow: 1,
          flexDirection: "row",
          margin: [0, null, "0 auto"],
          px: 0,
          maxWidth: "MAX_CONTENT_WIDTH",
          ...(sx || {}),
        }}
      >
        {children}
      </Flex>
      <Footer />
    </Flex>
  );
}
