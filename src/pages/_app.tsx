import ApplyMSAL from "@/components/ApplyMSAL";
import ApplyMUI from "@/components/ApplyMUI";
import TopBar from "@/components/TopBar";
import type { AppProps } from "next/app";
import Head from "next/head";
import { RecoilRoot } from "recoil";

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="description" content="Question Answer Portal" />
        <link rel="icon" href="favicon.ico" />
      </Head>
      <RecoilRoot>
        <ApplyMUI>
          <ApplyMSAL>
            <TopBar />
            <Component {...pageProps} />
          </ApplyMSAL>
        </ApplyMUI>
      </RecoilRoot>
    </>
  );
}

export default App;
