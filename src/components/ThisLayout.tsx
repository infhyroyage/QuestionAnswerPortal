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
