import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ColorModeContext } from "../contexts/ColorModeContext";

function App({ Component, pageProps }: AppProps) {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const toggleColorMode = useCallback(() => {
    setIsDarkMode(!isDarkMode);
  }, [isDarkMode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? "dark" : "light",
        },
      }),
    [isDarkMode]
  );

  useEffect(
    () =>
      setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches),
    []
  );

  return (
    <>
      <Head>
        <title>Question Answer Portal</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ColorModeContext.Provider value={{ isDarkMode, toggleColorMode }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </ColorModeContext.Provider>
    </>
  );
}

export default App;
