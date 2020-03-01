import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "../Typography";
import { faBars, faEnvelope, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
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

const UnstyledSlideNav = ({ show, close, ...all }) => {
  return (
    <Box
      position="fixed"
      height="100vh"
      width="80vw"
      maxWidth="80%"
      right="0px"
      top="0px"
      {...all}
    >
      <Box
        position="absolute"
        right="3"
        top="2"
        cursor="pointer"
        zIndex="1"
        onClick={close}
      >
        <FontAwesomeIcon icon={faTimes} />
      </Box>
      <Box
        position="absolute"
        right="0px"
        bottom="0px"
        width="50%"
        height="100vh"
        background="white"
        aria-hidden
      />
      <Box
        background="white"
        height="100vh"
        width="80vw"
        maxWidth="80%"
        transform="skewX(-20deg)"
        position="relative"
        paddingTop={MENU_HEIGHT}
        borderLeftWidth="2px"
        borderLeftColor="darkGray"
        borderLeftStyle="solid"
      >
        {links.map(l => (
          <Box key={l.label} transform="skewX(20deg)" paddingTop="2">
            <NavLink href={l.href} marginLeft="1">
              {l.label}
            </NavLink>
          </Box>
        ))}
        <Box
          transform="skewX(20deg)"
          paddingTop="2"
          textAlign="center"
          display="flex"
          flexDirection="row"
          justifyContent="center"
        >
          <Box>
            <NextLink href="https://github.com/jakobo" passHref>
              <Link color="darkGray">
                <FontAwesomeIcon icon={faGithub} fixedWidth />
              </Link>
            </NextLink>
          </Box>
          <Box paddingLeft="2" paddingRight="2">
            <NextLink href="https://linkedin.com/jakobheuser" passHref>
              <Link color="darkGray">
                <FontAwesomeIcon icon={faLinkedinIn} fixedWidth />
              </Link>
            </NextLink>
          </Box>
          <Box>
            <NextLink href="mailto:hi[at]codedrift.com" passHref>
              <Link color="darkGray">
                <FontAwesomeIcon icon={faEnvelope} fixedWidth />
              </Link>
            </NextLink>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const SlideNav = styled(UnstyledSlideNav)`
  opacity: 0;
  ${p =>
    p.show
      ? p.theme.animations.enterSlideLeft
      : p.theme.animations.exitSlideRight}
`;

const Layout = ({ children = [], title = null }) => {
  const { y } = useWindowScroll();
  const bp = useBreakpoint();
  const useMobileMenu = bp.xs;
  const [submenuOpen, setSubmenuOpen] = useState(false);

  useEffect(() => {
    if (!bp.md) return;
    setSubmenuOpen(false); // reset submenu
  }, [bp]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    document.body.style.overflowY = submenuOpen ? "hidden" : "auto";
  }, [submenuOpen]);

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
        background="white"
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
          background="white"
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
            justifyContent={useMobileMenu ? "end" : "start"}
          >
            {!useMobileMenu &&
              links.map(l => (
                <NavLink key={l.label} href={l.href} marginLeft="1">
                  {l.label}
                </NavLink>
              ))}
            {useMobileMenu && (
              <>
                <Box cursor="pointer" onClick={() => setSubmenuOpen(true)}>
                  <FontAwesomeIcon icon={faBars} />
                </Box>
                <Box marginLeft="1">
                  <SlideNav
                    show={submenuOpen}
                    close={() => setSubmenuOpen(false)}
                  />
                </Box>
              </>
            )}
          </Box>
        </Box>
        <Box
          paddingTop={MENU_HEIGHT}
          paddingLeft="2"
          paddingRight="2"
          minHeight="200vh"
        >
          <Box paddingTop="2" filter={submenuOpen ? "blur(1px)" : "none"}>
            {children}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Layout;
