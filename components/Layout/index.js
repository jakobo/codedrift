import { Link } from "../Typography";
import { useBreakpoint } from "~/hooks/useBreakpoints";
import { useWindowScroll } from "react-use";
import Box from "../Box";
import Head from "next/head";
import Logo from "../Logo";
import NextLink from "next/link";
import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
// import { useTheme} from "emotion-theming"

const NavLink = ({ href, children, ...rest }) => (
  <NextLink href={href} passHref>
    <Link {...rest}>{children}</Link>
  </NextLink>
);

const MENU_HEIGHT = "3rem";

const MenuDrop = styled(Box)`
  box-shadow: rgba(67, 90, 111, 0.3) 0px 0px 1px,
    rgba(67, 90, 111, 0.47) 0px 2px 4px -2px;
  opacity: 0;
  ${p => (p.show ? p.theme.animations.fadeIn : p.theme.animations.fadeOut)}
`;

const links = [
  { href: "/thoughts", label: "Writing" },
  { href: "/oss", label: "Open Source" },
  { href: "/about", label: "About" },
];

const SlideNav = ({ ...all }) => {
  return <Box {...all}>A</Box>;
};

const Layout = ({ children = [], title = null }) => {
  const { y } = useWindowScroll();
  const bp = useBreakpoint();
  // eslint-disable-next-line no-unused-vars
  const [submenuOpen, setSubmenuOpen] = useState(false);

  useEffect(() => {
    if (!bp.md) return;
    setSubmenuOpen(false); // reset submenu
  }, [bp]);

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
        paddingBottom="2"
      >
        <MenuDrop
          position="fixed"
          height={MENU_HEIGHT}
          left="0px"
          top="0px"
          width="100vw"
          maxWidth="100%"
          show={y > 0}
          aria-hidden
        />
        <Box
          display="flex"
          flexDirection="row"
          position="fixed"
          height={MENU_HEIGHT}
          background="red"
          width="100%"
          maxWidth="48rem"
        >
          <NextLink href="/" passHref>
            <Logo
              as="a"
              title="Home"
              maxWidth="10rem"
              maxHeight={MENU_HEIGHT}
            />
          </NextLink>
          <Box
            flexGrow="1"
            flexShrink="1"
            display="flex"
            flexDirection="row"
            alignItems="center"
            marginLeft="2"
            marginRight="2"
            justifyContent={bp.xs ? "end" : "start"}
          >
            {bp.sm &&
              links.map(l => (
                <NavLink key={l.label} href={l.href} marginLeft="1">
                  {l.label}
                </NavLink>
              ))}
            {bp.xs && <SlideNav marginLeft="1" />}
          </Box>
        </Box>
        <Box
          paddingTop={MENU_HEIGHT}
          paddingLeft="2"
          paddingRight="2"
          minHeight="200vh"
        >
          <Box paddingTop="2">{children}</Box>
        </Box>
      </Box>
    </>
  );
};

export default Layout;
