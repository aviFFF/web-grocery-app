import Head from "next/head";
export default function MyApp({ Component, pageProps }) {
    return (
      <>
        <Head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#000000" />
        </Head>
        <Component {...pageProps} />
      </>
    );
  }