import { A, H1, H2 } from "src/components/markup";
import { Box, Flex, Text } from "theme-ui";
import React from "react";

export const Brief = ({
  title,
  titleTag: TitleTag = H2,
  slug = "/",
  description,
  category,
  children,
  sx = {},
}) => {
  // rehype react places everything in a react fragment
  // the first child, whatever it is, will be our rich excerpt
  const frag = React.Children.toArray(children)[0];
  const first = frag?.props?.children
    ? React.Children.toArray(frag.props.children)[0]
    : null;

  return (
    <Box sx={{ ...(sx || {}) }}>
      <Flex sx={{ flexDirection: ["column", null, "row"] }}>
        <Box
          sx={{
            pl: [1, null, 0],
            pr: 1,
            textAlign: ["left", null, "right"],
            width: ["100%", null, "margin"],
            ml: [0, null, "negativeMargin"],
          }}
        >
          <A href="/" variant="category">
            {category}
          </A>
        </Box>
        <Box
          sx={{
            pr: [1, null, 0],
            pl: [1, null, 0],
            flexShrink: 0,
            width: ["100%", null, "reading"],
          }}
        >
          {" "}
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
          <TitleTag>{title}</TitleTag>
          <Box>{first}</Box>
          <Box>
            <Text>
              📖{" "}
              <A href={`/thunked/${slug}`}>
                Read in{" "}
                <Text as="span" sx={{ fontStyle: "italic" }}>
                  Thunked
                </Text>
              </A>
            </Text>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export const Post = ({
  title,
  titleTag: TitleTag = H1,
  description,
  category,
  children,
  tags = [],
  sx = {},
}) => {
  const allTags = [category, ...tags.map((t) => t.name)];
  return (
    <Box sx={{ ...(sx || {}) }}>
      <Flex sx={{ flexDirection: ["column", null, "row"] }}>
        <Box
          sx={{
            pl: [1, null, 0],
            pr: 1,
            textAlign: ["left", null, "right"],
            width: ["100%", null, "margin"],
            ml: [0, null, "negativeMargin"],
          }}
        ></Box>
        <Box
          sx={{
            pr: [1, null, 0],
            flexShrink: 0,
            width: ["100%", null, "reading"],
          }}
        >
          <TitleTag>{title}</TitleTag>
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
          <Box>{children}</Box>
          <Box>
            <Text variant="lead">
              {allTags.map((t, idx, all) => (
                <React.Fragment key={t}>
                  <A
                    variant="category"
                    href={`/thunked/tag/${t.toLowerCase()}`}
                  >
                    {t}
                  </A>
                  {idx < all.length - 1 ? ", " : ""}
                </React.Fragment>
              ))}
            </Text>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};
