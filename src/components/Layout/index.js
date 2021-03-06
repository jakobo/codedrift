import React, { useCallback } from "react";
import { Box, Flex, useThemeUI } from "theme-ui";
import Logo from "../logo";
import { A } from "../markup";
import { useResponsiveValue } from "@theme-ui/match-media";

const LARGE_ONLY = [false, false, true];
const MEDIUM_PLUS = [false, true, true];
const ALL_SIZES = [true, true, true];

const headerNavigation = [
  {
    sizes: LARGE_ONLY,
    title: "Home",
    url: "/",
  },
  {
    sizes: ALL_SIZES,
    title: "Archives",
    url: "/archives",
  },
  {
    sizes: ALL_SIZES,
    title: "Notes",
    url: "https://coda.io/d/Jakobs-Notes_dFBvQLDXnR5",
  },
  {
    sizes: MEDIUM_PLUS,
    title: "Speaking",
    url: "/speaking",
  },
  {
    sizes: MEDIUM_PLUS,
    title: "Code",
    url: "https://github.com/jakobo",
  },
  {
    sizes: LARGE_ONLY,
    title: "Aibex",
    url: "https://aibex.com",
  },
  {
    sizes: ALL_SIZES,
    title: "About",
    url: "/about",
  },
];

const footerNavigation = [
  {
    sizes: ALL_SIZES,
    title: "Home",
    url: "/",
  },
  {
    sizes: ALL_SIZES,
    title: "Archives",
    url: "/archives",
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
  const { colorMode, setColorMode } = useThemeUI();
  const navFilter = useResponsiveValue([0, 1, 2]);

  const flipLights = useCallback(() => {
    setColorMode(colorMode === "dark" ? "light" : "dark");
  }, [colorMode]);

  return (
    <Flex sx={{ flexDirection: "column", alignItems: "center" }}>
      <Box sx={{ bg: "gray.200", width: "100%" }}>
        <Flex
          sx={{
            flexDirection: "row",
            alignItems: "center",
            py: 1,
            px: 2,
            mx: "auto",
            maxWidth: "MAX_CONTENT_WIDTH",
          }}
        >
          <Logo
            left="secondary"
            right="primary"
            text={["secondary", "primary"]}
            sx={{ height: "30px" }}
          />
        </Flex>
      </Box>
      <Flex
        sx={{
          pb: 1,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: "MAX_CONTENT_WIDTH",
        }}
      >
        {headerNavigation
          .filter((item) => item.sizes[navFilter])
          .map((item, idx) => {
            const first = idx === 0;
            return (
              <Box
                key={item.url}
                sx={{
                  ml: first ? 0 : "quarter",
                }}
              >
                <A href={item.url} variant="nav">
                  {item.title}
                </A>
              </Box>
            );
          })}
        <Box sx={{ ml: "half" }} onClick={flipLights}>
          T | IN | B
        </Box>
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
