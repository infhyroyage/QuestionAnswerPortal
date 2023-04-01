import ApplyMUI from "@/components/ApplyMUI";
import LoadingCenter from "@/components/LoadingCenter";
import TopBar from "@/components/TopBar";
import { config, loginScope } from "@/services/msal";
import { InteractionType, PublicClientApplication } from "@azure/msal-browser";
import { MsalAuthenticationTemplate, MsalProvider } from "@azure/msal-react";
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
        <ApplyMUI>
          <MsalProvider instance={msalInstance}>
            <MsalAuthenticationTemplate
              interactionType={InteractionType.Redirect}
              authenticationRequest={loginScope}
              loadingComponent={LoadingCenter}
            >
              <TopBar />
              <Component {...pageProps} />
            </MsalAuthenticationTemplate>
          </MsalProvider>
        </ApplyMUI>
      </RecoilRoot>
    </>
  );
}

export default App;
