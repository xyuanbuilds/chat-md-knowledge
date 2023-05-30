import React from "react";
import { Html, Head, Main, NextScript } from "next/document";
// import { CssBaseline } from "@nextui-org/react";

export default function Document() {
  return (
    <Html data-color-mode="light" lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

// class MyDocument extends Document {
//   static async getInitialProps(ctx: any) {
//     const initialProps = await Document.getInitialProps(ctx);
//     return {
//       ...initialProps,
//       styles: React.Children.toArray([initialProps.styles]),
//     };
//   }

//   render() {
//     return (
//       <Html data-color-mode="light" lang="en">
//         <Head>{CssBaseline.flush()}</Head>
//         <body>
//           <Main />
//           <NextScript />
//         </body>
//       </Html>
//     );
//   }
// }

// export default MyDocument;
