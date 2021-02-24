import Document, { Head, Html, Main, NextScript } from "next/document";
import React from "react";

const bodyStyles = {
  margin: 0,
  padding: 0,
  overflowX: "hidden",
};

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body style={bodyStyles}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
