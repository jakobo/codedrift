import React from "react";
import { Box, Flex, Link, Text } from "theme-ui";
import { createParser } from "src/lib/markdown";
import { H1, A } from "src/components/markup";
import NextImage from "next/image";
import { BASELINE } from "src/theme";

const WIDTH_EXTRACTOR = /^(.*)[\s+]?\(([\d]+x[\d]+)\)/; // "alt text (widthxheight)"
const PostImage = ({ src, alt, ...props } = {}) => {
  let width, height;
  let realAlt = alt;
  const matches = `${alt}`.match(WIDTH_EXTRACTOR);
  if (matches) {
    const [, altR, size] = matches;
    console.log(size);
    [width, height] = size.split("x");
    realAlt = altR;
  }

  // we need to know the height to maintain vert. ryth.
  if (!width && !height) {
    console.log(
      `The image ${src} does not have its width and height set in the alt text and will not be shown`
    );
    return null; // do not render, but do log as todo
  }

  // remainder + 1 unit of baseline
  const padding = (height % BASELINE) + BASELINE * 1;

  return (
    <Box
      sx={{
        width: "100%",
        textAlign: "center",
        maxWidth: "100%",
        pb: `${padding}px`,
      }}
    >
      <NextImage
        src={src}
        alt={realAlt}
        width={width}
        height={height}
        style={{ margin: "0 auto" }}
        {...props}
      />
    </Box>
  );
};

const postParser = createParser({
  headerLevel: 2,
  components: {
    img: PostImage,
  },
});

export const Post = ({ title, description, category, children, sx = {} }) => {
  return (
    <Box sx={{ ...(sx || {}) }}>
      <Flex sx={{ flexDirection: ["column", null, "row"] }}>
        <Box
          sx={{
            flexGrow: 1,
            pl: [1, null, 0],
            textAlign: ["left", null, "right"],
          }}
        >
          <A
            variant="category"
            href={`/archives/tag/${category.toLowerCase()}`}
            sx={{
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            {`${category}`.toLowerCase()}
          </A>
        </Box>
        <Box
          sx={{
            pl: 1,
            pr: [1, null, 0],
            flexShrink: 0,
            width: ["100%", null, "content"],
          }}
        >
          <Text
            variant="lead"
            sx={{
              overflow: [null, null, "hidden"],
              textOverflow: [null, null, "ellipsis"],
              whiteSpace: [null, null, "nowrap"],
            }}
          >
            {`${description}`.toLowerCase()}
          </Text>
          <H1 as="h2">{title}</H1>
          <Box>{children}</Box>
        </Box>
      </Flex>
    </Box>
  );
};
