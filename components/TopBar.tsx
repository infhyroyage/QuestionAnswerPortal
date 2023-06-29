"use client";

import {
  AppBar,
  Box,
  IconButton,
  LinearProgress,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useMsal } from "@azure/msal-react";
import ThemeSwitch from "./ThemeSwitch";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import {
  isShownSystemErrorSnackbarState,
  isShownTopProgressState,
  topBarTitleState,
} from "../services/atoms";
import BackspaceIcon from "@mui/icons-material/Backspace";
import { useRecoilState, useSetRecoilState } from "recoil";

function TopBar() {
  const [topBarTitle, setTopBarTitle] =
    useRecoilState<string>(topBarTitleState);
  const [isShownTopProgress, setIsShownTopProgress] = useRecoilState<boolean>(
    isShownTopProgressState
  );
  const setIsShownSystemErrorSnackbar = useSetRecoilState<boolean>(
    isShownSystemErrorSnackbarState
  );

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { instance } = useMsal();

  const onClickLogoutButton = async () => {
    try {
      await instance.logoutRedirect();
    } catch (e) {
      console.error(e);
      setIsShownSystemErrorSnackbar(true);
    }
  };

  const onClickBackspaceButton = () => {
    setIsShownTopProgress(true);
    setTopBarTitle("Question Answer Portal");
    router.push("/");
  };

  // Next.js v12までのrouter.eventsに相当する機能は、
  // v13にて、pathname、searchParamsに依存するuseEffectで実装可能
  // https://nextjs.org/docs/app/api-reference/functions/use-router#router-events
  useEffect(() => {
    setIsShownTopProgress(false);
  }, [pathname, searchParams, setIsShownTopProgress]);

  return (
    <>
      <AppBar position="sticky" sx={{ height: "64px" }}>
        <Toolbar sx={{ height: "100%" }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {topBarTitle}
          </Typography>
          <Stack direction="row" spacing={3}>
            {pathname === "/" && <ThemeSwitch />}
            {pathname !== "/" ? (
              <Tooltip title="タイトルへ">
                <IconButton onClick={onClickBackspaceButton}>
                  <BackspaceIcon sx={{ color: "white" }} />
                </IconButton>
              </Tooltip>
            ) : (
              process.env.NEXT_PUBLIC_API_URI !== "http://localhost:9229" && (
                <Tooltip title="ログアウト">
                  <IconButton onClick={onClickLogoutButton}>
                    <LogoutIcon sx={{ color: "white" }} />
                  </IconButton>
                </Tooltip>
              )
            )}
          </Stack>
        </Toolbar>
      </AppBar>
      {isShownTopProgress ? (
        <LinearProgress />
      ) : (
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            display: "block",
            height: "4px",
            zIndex: "0",
          }}
        />
      )}
    </>
  );
}

export default TopBar;
