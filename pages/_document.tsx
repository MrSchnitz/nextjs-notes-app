import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";
import { ServerStyleSheet } from "styled-components";
import React from "react";
import {resetServerContext} from "react-beautiful-dnd";

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    resetServerContext();

    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => {
            resetServerContext();

            return sheet.collectStyles(<App {...props} />);
          }
        });

      resetServerContext();

      const initialProps = await Document.getInitialProps(ctx);

      resetServerContext();

      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      resetServerContext();
      sheet.seal();
      resetServerContext();

    }
    resetServerContext();

  }
  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
