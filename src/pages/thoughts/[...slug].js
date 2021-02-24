import { Heading, Link, Paragraph } from "src/components/Typography";
import { List, ListItem } from "src/components/List";
import { getPagePath } from "src/lib/urls/pages";
import { useEffect, useRef, useState } from "react";
import Blockquote from "src/components/Blockquote";
import Box from "src/components/Box";
import Layout from "src/components/layout/old";
import NextLink from "next/link";
import React from "react";
import ReactMarkdown from "react-markdown";
import d from "debug";

const idSlug = (s) =>
  s
    .replace(/[\s]+/g, "-")
    .replace(/[-]{2,}/g, "-")
    .toLowerCase();

const ParagraphRenderer = ({ children, ...rest }) => {
  const hasImage = !!children.find(
    (child) =>
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

const ImageRenderer = (props) => <Box as="img" maxWidth="80%" {...props} />;

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
  debug("Rendering Post: %o", metadata);
  return (
    <Layout title={metadata.title}>
      <Heading as="h1">{metadata.title}</Heading>
      <ReactMarkdown source={content} renderers={renderers} />
    </Layout>
  );
};

export async function getStaticPaths() {
  const { allPosts } = await import("src/lib/blog/posts");
  const posts = await allPosts();

  const paths = [];
  for (const p of Object.keys(posts)) {
    const post = posts[p];
    if (!post.metadata.published) return;
    for (const lang of Object.keys(post.variants)) {
      paths.push({
        params: {
          slug:
            lang === "en-us"
              ? [post.metadata.slug]
              : [post.metadata.slug, lang],
        },
      });
    }
  }

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  // extract post name[0] and lang[1]
  const { slug } = params;
  const [name, lang = "en-us"] = slug;

  // get post data
  const { onePost } = await import("src/lib/blog/posts");
  const post = await onePost(name, lang);

  return {
    props: {
      metadata: post.metadata,
      content: post.content,
    },
  };
}

export default BlogPost;
