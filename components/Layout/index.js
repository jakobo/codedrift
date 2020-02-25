import { Link } from "../Typography";
import Box from "../Box";
import Head from "next/head";
import Logo from "../Logo";
import NextLink from "next/link";
import React from "react";

const NavLink = ({ href, children, ...rest }) => (
  <NextLink href={href} passHref>
    <Link {...rest}>{children}</Link>
  </NextLink>
);

const Layout = ({ children = [], title = null }) => {
  return (
    <>
      <Head>
        <title>
          {title
            ? `${title} - codedrift by Rudolph Jakob Heuser`
            : "codedrift - Rudolph Jakob Heuser"}
        </title>
      </Head>
      <Box
        minWidth="405px"
        maxWidth="48rem"
        background="olive"
        marginLeft="auto"
        marginRight="auto"
        padding="2"
      >
        <Box display="flex" flexDirection="row">
          <NextLink href="/" passHref>
            <Logo as="a" title="Home" maxWidth="10rem" />
          </NextLink>
          <Box
            flexGrow="1"
            flexShrink="1"
            display="flex"
            flexDirection="row"
            alignItems="center"
            marginLeft="2"
          >
            <NavLink href="/thoughts" marginLeft="1">
              Writing
            </NavLink>
            <NavLink href="/oss" marginLeft="1">
              Open Source
            </NavLink>
            <NavLink marginLeft="1" href="/about">
              About
            </NavLink>
          </Box>
        </Box>
        <Box>{children}</Box>
      </Box>
    </>
  );
};
Layout.displayName = "Layout";

export default Layout;
