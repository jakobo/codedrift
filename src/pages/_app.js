import "tailwindcss/tailwind.css";
import Head from "next/head";
import Providers from "src/providers";
import React from "react";

// https://csswizardry.com/2019/08/making-cloud-typography-faster/
// next/head requires an inline onload handler
const App = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="HandheldFriendly" content="True" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="referrer" content="no-referrer-when-downgrade" />
        <meta property="og:site_name" content="Code Drift" />
        <link
          onLoad="this.media='all'"
          media="print"
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
