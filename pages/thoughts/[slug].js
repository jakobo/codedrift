import React from "react";
import d from "debug";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import { Heading, Paragraph, Link } from "~/components/Typography";
import Blockquote from "~/components/Blockquote";
import { List, ListItem } from "~/components/List";
import Layout from "~/components/Layout";
import Box from "~/components/Box";
import { getPagePath } from "~/lib/urls/pages";
import NextLink from "next/link";

const ParagraphRenderer = ({ children, ...rest }) => {
  const hasImage = !!children.find(
    child =>
      typeof child === "object" && child.key && !!child.key.match(/img|image/g)
  );
  return hasImage ? (
    <Paragraph {...rest} textAlign="center">
      {children}
    </Paragraph>
  ) : (
    <Paragraph {...rest}>{children}</Paragraph>
  );
};

const LinkRenderer = ({ href, ...rest }) => {
  const nextPath = getPagePath(href);
  return nextPath ? (
    <NextLink href={nextPath} as={href} passHref>
      <Link {...rest} />
    </NextLink>
  ) : (
    <Link href={href} {...rest} />
  );
};

const ImageRenderer = props => <Box as="img" maxWidth="80%" {...props} />;

const renderers = {
  paragraph: ParagraphRenderer,
  heading: Heading,
  list: List,
  listItem: ListItem,
  blockquote: Blockquote,
  image: ImageRenderer,
  link: LinkRenderer,
};

const debug = d("CodeDrift:BlogPost");
const BlogPost = ({ metadata, content }) => {
  return (
    <Layout>
      <ReactMarkdown source={content} renderers={renderers} />
    </Layout>
  );
};

BlogPost.getInitialProps = async ctx => {
  const { slug } = ctx.query;
  debug("BlogPost slug is: %s", slug);

  const content = await import(`~/data/blog/${slug}/index.md`);
  const post = matter(content.default);

  return {
    metadata: post.data,
    content: post.content.trim(),
  };
};

export default BlogPost;
