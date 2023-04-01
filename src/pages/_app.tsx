import ApplyMUI from "@/components/ApplyMUI";
import { config } from "@/services/msal";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { RecoilRoot } from "recoil";

function App({ Component, pageProps }: AppProps) {
  const msalInstance = new PublicClientApplication(config);

  return (
    <>
      <Head>
        <title>Question Answer Portal</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <RecoilRoot>
        <MsalProvider instance={msalInstance}>
          <ApplyMUI>
            <Component {...pageProps} />
          </ApplyMUI>
        </MsalProvider>
      </RecoilRoot>
    </>
  );
}

export default App;
