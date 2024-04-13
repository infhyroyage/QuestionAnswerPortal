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
import {
  isShownSystemErrorSnackbarState,
  topBarTitleState,
} from "../services/atoms";
import BackspaceIcon from "@mui/icons-material/Backspace";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useLocation, useNavigate, useNavigation } from "react-router-dom";

function TopBar() {
  const [topBarTitle, setTopBarTitle] =
    useRecoilState<string>(topBarTitleState);
  const setIsShownSystemErrorSnackbar = useSetRecoilState<boolean>(
    isShownSystemErrorSnackbarState
  );

  const location = useLocation();
  const navigate = useNavigate();
  const navigation = useNavigation();

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
    setTopBarTitle("Question Answer Portal");
    navigate("/");
  };

  return (
    <>
      <AppBar position="sticky" sx={{ height: "64px" }}>
        <Toolbar sx={{ height: "100%" }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {topBarTitle}
          </Typography>
          <Stack direction="row" spacing={3}>
            {location.pathname === "/" && <ThemeSwitch />}
            {location.pathname !== "/" ? (
              <Tooltip title="タイトルへ">
                <IconButton onClick={onClickBackspaceButton}>
                  <BackspaceIcon sx={{ color: "white" }} />
                </IconButton>
              </Tooltip>
            ) : (
              process.env.VITE_API_URI !== "http://localhost:9229" && (
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
      {navigation.state !== "idle" ? (
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
