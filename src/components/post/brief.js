import React from "react";
import { md2jsx } from "src/lib/markdown";
import { Box, Heading } from "theme-ui";

export default function BriefPost({ post, sx = {} }) {
  const description = md2jsx(post.description || "").result;
  return (
    <Box sx={{ ...(sx || {}) }}>
      <Heading as="h2" variant="title">
        {post.title}
      </Heading>
      <>{description}</>
    </Box>
  );
}
