import Document, { Html, Head, Main, NextScript } from "next/document";
class MainDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link href="/favicon.ico" rel="icon" type="image/png" />
        </Head>
        <body className="text-black">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
export default MainDocument;
