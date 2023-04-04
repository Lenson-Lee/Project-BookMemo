import Document, { DocumentContext, Html } from "next/document";
import { ServerStyleSheet } from "styled-components";
//@ts-ignore
import bundleCss from "!raw-loader!../styles/tailwindSSR.css"; //빌드한거 import

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();

    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);

      return {
        ...initialProps,
        styles: (
          <Html className=" dark">
            {initialProps.styles}
            {sheet.getStyleElement()}
            <style
              key="custom"
              dangerouslySetInnerHTML={{
                __html: bundleCss,
              }}
            />
            ,
          </Html>
        ),
      };
    } finally {
      sheet.seal();
    }
  }
}
