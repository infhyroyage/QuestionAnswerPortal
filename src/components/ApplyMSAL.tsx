import { ApplyMSALProps } from "../types/props";
import LoadingCenter from "./LoadingCenter";
import { MsalAuthenticationTemplate, MsalProvider } from "@azure/msal-react";
import { InteractionType, PublicClientApplication } from "@azure/msal-browser";
import { config, loginScope } from "../services/msal";

function ApplyMSAL({ children }: ApplyMSALProps) {
  const msalInstance = new PublicClientApplication(config);

  // localhost環境の場合はMSALを使用しない
  return process.env.REACT_APP_API_URI === "http://localhost:9229" ? (
    <>{children}</>
  ) : (
    <MsalProvider instance={msalInstance}>
      <MsalAuthenticationTemplate
        interactionType={InteractionType.Redirect}
        authenticationRequest={loginScope}
        loadingComponent={LoadingCenter}
      >
        <>{children}</>
      </MsalAuthenticationTemplate>
    </MsalProvider>
  );
}

export default ApplyMSAL;
