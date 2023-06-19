import { useEffect, useMemo } from "react";
import { isDarkModeState } from "@/services/atoms";
import { ApplyMUIProps } from "@/types/props";
import { useRecoilState } from "recoil";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

function ApplyMUI({ children }: ApplyMUIProps) {
  const [isDarkMode, setIsDarkMode] = useRecoilState<boolean>(isDarkModeState);

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
    [setIsDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export default ApplyMUI;
