import "tailwindcss/tailwind.css";
import "public/styles/custom.css";
import Head from "next/head";
import React from "react";
import type { AppProps /*, AppContext */ } from "next/app";
import { DefaultSeo } from "next-seo";
import { Analytics } from "@vercel/analytics/react";
import { Providers } from "components/providers";

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
            images: [
              {
                url: "https://codedrift.com/images/v2.og.png",
                width: 1200,
                height: 600,
                alt: "Codedrift",
              },
            ],
          }}
          twitter={{
            handle: "@jakobo",
            cardType: "summary_large_image",
          }}
        />
        <Component {...pageProps} />
      </Providers>
      <Analytics />
    </>
  );
};

export default App;
