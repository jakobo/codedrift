import React, { useCallback } from "react";
import { Box, Flex, useThemeUI } from "theme-ui";
import Logo from "../logo";

const LARGE_ONLY = ["none", null, "block"];
const MEDIUM_PLUS = ["none", "block", null];

function TitleBar() {
  const { colorMode, setColorMode } = useThemeUI();

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
        <Box sx={{ display: LARGE_ONLY }}>Home</Box>
        <Box>Archives</Box>
        <Box>Notes</Box>
        <Box sx={{ display: MEDIUM_PLUS }}>Speaking</Box>
        <Box sx={{ display: MEDIUM_PLUS }}>Code</Box>
        <Box sx={{ display: LARGE_ONLY }}>Aibex</Box>
        <Box>About</Box>
        <Box onClick={flipLights}>T | IN | B</Box>
      </Flex>
    </Flex>
  );
}

const Footer = () => {
  return (
    <Flex sx={{ flexDirection: "column", alignItems: "center", mt: 2 }}>
      <Box sx={{ bg: "secondary", width: "100%" }}>
        <Flex
          sx={{ flexDirection: "row", pt: 2, pb: 2, justifyContent: "center" }}
        >
          <Box>Home</Box>
          <Box>Archives</Box>
          <Box>About</Box>
          <Box>Contact</Box>
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
