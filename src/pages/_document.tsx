import Document, { Head, Html, Main, NextScript } from "next/document";
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
        </Head>
        <body
          className="bg-gray-100 bg-texture dark:bg-texture-invert dark:bg-gray-900 text-gray-800 dark:text-gray-100"
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
