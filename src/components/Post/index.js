import { A, H1, H2 } from "src/components/markup";
import { Box, Flex, Text } from "theme-ui";
import React from "react";

export const Brief = ({
  titleTag: TitleTag = H2,
  slug = "/",
  children,
  ...rest
}) => {
  // rehype react places everything in a react fragment
  // the first child, whatever it is, will be our rich excerpt
  const frag = React.Children.toArray(children)[0];
  const first = frag?.props?.children
    ? React.Children.toArray(frag.props.children)[0]
    : null;

  return (
    <Post
      titleTag={TitleTag}
      slug={slug}
      eplilogue={
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
      }
      {...rest}
    >
      {first}
    </Post>
  );
};

export const Post = ({
  title,
  titleTag: TitleTag = H1,
  // slug = "/",
  description,
  category,
  children,
  prologue = null,
  eplilogue = null,
  sx = {},
}) => (
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
        {prologue === null ? null : <Box>{prologue}</Box>}
        <Box>{children}</Box>
        {eplilogue === null ? null : <Box>{eplilogue}</Box>}
      </Box>
    </Flex>
  </Box>
);
