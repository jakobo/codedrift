import Document, { Head, Html, Main, NextScript } from "next/document";
import React from "react";

const bodyStyles = {
  margin: 0,
  padding: 0,
  minHeight: "100vh",
};

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    // TODO emotion integration
    const { renderPage } = ctx;
    const page = renderPage();
    const initialProps = await Document.getInitialProps(ctx);
    return { ...page, ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="stylesheet" href="https://use.typekit.net/izt4dlr.css" />
        </Head>
        <body style={bodyStyles}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
