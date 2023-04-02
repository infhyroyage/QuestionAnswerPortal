import ThisLayout from "@/components/ThisLayout";
import type { AppProps } from "next/app";

function App({ Component, pageProps }: AppProps) {
  return (
    <ThisLayout>
      <Component {...pageProps} />
    </ThisLayout>
  );
}

export default App;
