import ApplyMUI from "@/components/ApplyMUI";
import type { AppProps } from "next/app";
import Head from "next/head";
import { RecoilRoot } from "recoil";

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Question Answer Portal</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <RecoilRoot>
        <ApplyMUI>
          <Component {...pageProps} />
        </ApplyMUI>
      </RecoilRoot>
    </>
  );
}

export default App;
