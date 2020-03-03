import { Link, Paragraph } from "~/components/Typography";
import { useBreakpoint } from "~/hooks/useBreakpoints";
import Box from "~/components/Box";
import Card from "~/components/Card";
import Layout from "~/components/Layout";
import React from "react";
import fetch from "cross-fetch";

/**
 * TODO list
 * - get the three most recent posts
 * - get an about that goes to /about
 * - get a blurb about aibex
 */

const Homepage = ({ photos = [] }) => {
  const bp = useBreakpoint();
  return (
    <>
      <Layout>
        <Box display="flex" flexDirection="row">
          <Box
            flex="1 1 auto"
            maxWidth="80px"
            maxHeight="80px"
            border="1px solid"
            borderColor="darkGray"
            borderRadius="50%"
            overflow="hidden"
            marginRight="2"
          >
            <img
              src="/static/images/headshot.jpg"
              alt="Jakob Heuser"
              width="100%"
              height="100%"
            />
          </Box>
          <Paragraph>
            👋🏻 I&lsquo;m Jakob. I Co-Founded{" "}
            <Link href="https://aibex.com">Aibex</Link>, an AI Career Coach and
            Mentor and am on a personal mission to help everyone get the most
            from their careers. When not building things, I can be found in rice
            marshes hunting waterfowl. 🦆 Also,{" "}
            <Link href="https://github.com/Jakobo/ama">I love questions</Link>.
          </Paragraph>
        </Box>
        <Box>TODO latest post</Box>
        <Box display="flex" flexDirection={bp.xs ? "column" : "row"}>
          <Card width={bp.xs ? "auto" : "50%"}>TODO github thing</Card>
          <Card
            width={bp.xs ? "auto" : "50%"}
            display="flex"
            flexDirection="row"
            flexWrap="wrap"
            justifyContent="center"
          >
            {photos.slice(0, 4).map(p => (
              <IgPhoto key={p.id} photo={p} width="33%" maxWidth="300px" />
            ))}
            <IgPhoto
              photo={{
                media_url: "/static/images/jakobheuser_nametag.png",
                caption: "View on Instagram",
                permalink: "https://instagram.com/jakobheuser",
              }}
              width="33%"
              maxWidth="300px"
            />
            {photos.slice(4, 8).map(p => (
              <IgPhoto key={p.id} photo={p} width="33%" maxWidth="300px" />
            ))}
          </Card>
        </Box>
      </Layout>
    </>
  );
};

const IgPhoto = ({ photo, ...rest }) => (
  <Box {...rest}>
    <a href={photo.permalink}>
      <img
        src={photo.media_url}
        title={photo.caption}
        width="100%"
        height="100%"
      />
    </a>
  </Box>
);

// gql request for ig feed
const IGT = `IGQVJWSC1aY0ZApZADhHRVhGZAnZAHSjRmWWhvUGhILVRqUldsLWFtUktyQUNtdDZAuaFI3QURpUmVTTTN0QllzVGxUVWk5R0ItQWxYY2RhVXY3dDN3Ykl0RFhVblFNdUhYR0h3QjBLeDdR`;
const IG_URL = `https://graph.instagram.com/me/media?fields=id,caption,permalink,media_url&access_token=${IGT}&limit=8`;

Homepage.getInitialProps = async () => {
  const res = await fetch(IG_URL, {
    method: "GET",
  });
  const result = await res.json();
  const photos = result?.data || [];
  return {
    photos,
  };
};

export default Homepage;
