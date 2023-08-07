import Document, { Head, Html, Main, NextScript } from "next/document.js";
import React from "react";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;800&family=Roboto+Mono:wght@300&family=Work+Sans:wght@300&display=swap"
            rel="stylesheet"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#047857" />
          <meta name="msapplication-TileColor" content="#00aba9" />
          <meta name="theme-color" content="#f5f5f4" />
        </Head>
        <body
          className="bg-gray-100 bg-paper-stone-200 text-gray-800 dark:bg-gray-900 dark:bg-paper-stone-800 dark:text-gray-100"
          style={{
            margin: 0,
            padding: 0,
            overflowX: "hidden",
            transition: "all 0.5s",
          }}
        >
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
