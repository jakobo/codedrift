import "tailwindcss/tailwind.css";
import "../../public/styles/prism.css";
import "../../public/styles/custom.css";
import Head from "next/head";
import { Providers } from "src/providers";
import React from "react";
import type { AppProps /*, AppContext */ } from "next/app";

// https://csswizardry.com/2019/08/making-cloud-typography-faster/
// next/head requires an inline onload handler
// 2021-11-07: Dropped the hack, as the FOUC was super bothersome
const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="HandheldFriendly" content="True" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="referrer" content="no-referrer-when-downgrade" />
        <meta property="og:site_name" content="Code Drift" />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cloud.typography.com/7828318/7442832/css/fonts.css"
        />
      </Head>
      <Providers>
        <Component {...pageProps} />
      </Providers>
    </>
  );
};

export default App;
