"use client";

import { RootLayoutProps } from "../types/props";
import { RecoilRoot } from "recoil";
import ApplyMUI from "../components/ApplyMUI";
import ApplyMSAL from "../components/ApplyMSAL";
import TopBar from "../components/TopBar";
import SystemErrorSnackbar from "../components/SystemErrorSnackbar";

function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ja">
      <head>
        <link rel="icon" href="favicon.ico" />
        <meta name="description" content="Question Answer Portal" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Question Answer Portal</title>
      </head>
      <body>
        <RecoilRoot>
          <ApplyMUI>
            <ApplyMSAL>
              <TopBar />
              {children}
            </ApplyMSAL>
            <SystemErrorSnackbar />
          </ApplyMUI>
        </RecoilRoot>
      </body>
    </html>
  );
}

export default RootLayout;
