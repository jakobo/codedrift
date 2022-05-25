import "tailwindcss/tailwind.css";
import "../../public/styles/prism.css";
import "../../public/styles/custom.css";
import Head from "next/head";
import { Providers } from "src/providers";
import React from "react";
import type { AppProps /*, AppContext */ } from "next/app";
import { DefaultSeo } from "next-seo";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="HandheldFriendly" content="True" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="referrer" content="no-referrer-when-downgrade" />
      </Head>
      <Providers>
        <DefaultSeo
          title="Jakob Heuser @ Codedrift"
          titleTemplate="%s | Codedrift"
          openGraph={{
            type: "website",
            locale: "en_US",
            url: "https://codedrift.com",
            site_name: "Codedrift",
          }}
          twitter={{
            handle: "@jakobo",
            cardType: "summary_large_image",
          }}
        />
        <Component {...pageProps} />
      </Providers>
    </>
  );
};

export default App;
