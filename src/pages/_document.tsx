import Document, { Head, Html, Main, NextScript } from "next/document";
import React from "react";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body
          className="bg-light dark:bg-dark text-dark dark:text-light"
          style={{
            margin: 0,
            padding: 0,
            overflowX: "hidden",
            minHeight: "101vh",
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