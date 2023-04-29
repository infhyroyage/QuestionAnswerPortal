import ApplyMSAL from "@/components/ApplyMSAL";
import ApplyMUI from "@/components/ApplyMUI";
import TopBar from "@/components/TopBar";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";

function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <ApplyMUI>
        <ApplyMSAL>
          <TopBar />
          <Component {...pageProps} />
        </ApplyMSAL>
      </ApplyMUI>
    </RecoilRoot>
  );
}

export default App;
