import TopBar from "@/components/TopBar";
import { RecoilRoot } from "recoil";
import { ThisLayoutProps } from "@/types/props";
import Head from "next/head";
import ApplyMUI from "./ApplyMUI";
import ApplyMSAL from "./ApplyMSAL";

function ThisLayout({ children }: ThisLayoutProps) {
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
          <ApplyMSAL>
            <TopBar />
            {children}
          </ApplyMSAL>
        </ApplyMUI>
      </RecoilRoot>
    </>
  );
}

export default ThisLayout;
