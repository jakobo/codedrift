import { Heading, Link, Paragraph } from "~/components/Typography";
import { List, ListItem } from "~/components/List";
import { getPagePath } from "~/lib/urls/pages";
import { useEffect, useRef, useState } from "react";
import Blockquote from "~/components/Blockquote";
import Box from "~/components/Box";
import Layout from "~/components/Layout";
import NextLink from "next/link";
import React from "react";
import ReactMarkdown from "react-markdown";
import d from "debug";
import matter from "gray-matter";

const idSlug = s =>
  s
    .replace(/[\s]+/g, "-")
    .replace(/[-]{2,}/g, "-")
    .toLowerCase();

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

const HeadingRender = ({ level, children, ...rest }) => {
  const el = useRef(null);
  const [id, setId] = useState("");
  useEffect(() => {
    setId(idSlug(el.current.innerHTML.trim()));
  }, []);
  return (
    <Heading ref={el} as={`h${level}`} id={id} includeAnchor {...rest}>
      {children}
    </Heading>
  );
};

const renderers = {
  paragraph: ParagraphRenderer,
  heading: HeadingRender,
  list: List,
  listItem: ListItem,
  blockquote: Blockquote,
  image: ImageRenderer,
  link: LinkRenderer,
};

const debug = d("CodeDrift:BlogPost");
const BlogPost = ({ metadata, content }) => {
  return (
    <Layout title={metadata.title}>
      <Heading as="h1">{metadata.title}</Heading>
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
