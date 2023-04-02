import LoadingCenter from "@/components/LoadingCenter";
import TopBar from "@/components/TopBar";
import { config, loginScope } from "@/services/msal";
import { InteractionType, PublicClientApplication } from "@azure/msal-browser";
import { MsalAuthenticationTemplate, MsalProvider } from "@azure/msal-react";
import { RecoilRoot } from "recoil";
import { ThisLayoutProps } from "@/types/props";
import Head from "next/head";
import ApplyMUI from "./ApplyMUI";

function ThisLayout({ children }: ThisLayoutProps) {
  const msalInstance = new PublicClientApplication(config);

  return (
    <>
      <Head>
        <title>Question Answer Portal</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Question Answer Portal" />
        <link rel="icon" href="favicon.ico" />
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
              {children}
            </MsalAuthenticationTemplate>
          </MsalProvider>
        </ApplyMUI>
      </RecoilRoot>
    </>
  );
}

export default ThisLayout;
