/** @jsx jsx */
import "./reset.css";
import { css, jsx, keyframes } from "@emotion/core";
import { useEffect, useState } from "react";
import { windowHelpers } from "~/lib/window";
import Box from "~/components/Box";
import Providers from "~/lib/providers";

const ANIMATION_DURATION = 200;
const animationEasing = {
  deceleration: `cubic-bezier(0.0, 0.0, 0.2, 1)`,
  acceleration: `cubic-bezier(0.4, 0.0, 1, 1)`,
};

const appFadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const animationStyles = css`
  opacity: 0;
  &[data-state="ready"] {
    animation: ${appFadeIn} ${ANIMATION_DURATION}ms
      ${animationEasing.deceleration} forwards;
  }
`;

const App = ({ Component, pageProps }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    windowHelpers();
    setReady(true);
  }, []);

  return (
    <>
      <Providers>
        <Box css={animationStyles} data-state={ready ? "ready" : ""}>
          <Component {...pageProps} />
        </Box>
      </Providers>
    </>
  );
};

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
export default App;
