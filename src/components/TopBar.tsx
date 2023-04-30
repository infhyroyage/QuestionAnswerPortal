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
import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import Head from "next/head";

function TopBar() {
  const [isShownProgress, setIsShownProgress] = useState<boolean>(false);

  const router = useRouter();

  const { instance } = useMsal();

  const onClickLogoutButton = async () => {
    try {
      await instance.logoutRedirect();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRouteChangeShow = () => setIsShownProgress(true);
  const handleRouteChangeHide = () => setIsShownProgress(false);

  useEffect(() => {
    router.events.on("routeChangeStart", handleRouteChangeShow);
    router.events.on("routeChangeComplete", handleRouteChangeHide);
    router.events.on("routeChangeError", handleRouteChangeHide);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeShow);
      router.events.off("routeChangeComplete", handleRouteChangeHide);
      router.events.off("routeChangeError", handleRouteChangeHide);
    };
  }, [router]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Question Answer Portal</title>
      </Head>
      <AppBar position="sticky" sx={{ height: "64px" }}>
        <Toolbar sx={{ height: "100%" }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <Link
              href="/"
              style={{
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Question Answer Portal
            </Link>
          </Typography>
          <Stack direction="row" spacing={3}>
            <ThemeSwitch />
            {process.env.NEXT_PUBLIC_API_URI !== "http://localhost:9229" && (
              <Tooltip title="ログアウト">
                <IconButton onClick={onClickLogoutButton}>
                  <LogoutIcon sx={{ color: "white" }} />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Toolbar>
      </AppBar>
      {isShownProgress ? (
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
