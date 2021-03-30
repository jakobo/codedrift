import "tailwindcss/tailwind.css";
import Head from "next/head";
import Providers from "src/providers";
import React from "react";

const App = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
