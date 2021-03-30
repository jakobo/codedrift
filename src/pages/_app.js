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
      </Head>
      <Providers>
        <Component {...pageProps} />
      </Providers>
    </>
  );
};

export default App;
