import { useEffect, useMemo } from "react";
import { isDarkModeState } from "@/states/color";
import { ApplyMUIComponentProps } from "@/types/props";
import { useRecoilState } from "recoil";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

function ApplyMUI({ children }: ApplyMUIComponentProps) {
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
    []
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export default ApplyMUI;
