import {
  AppBar,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRecoilValue } from "recoil";
import { titleState } from "@/states/title";
import { useMsal } from "@azure/msal-react";
import ThemeSwitch from "./ThemeSwitch";

function TopBar() {
  const title = useRecoilValue<string>(titleState);
  const { instance } = useMsal();

  const onClickLogoutButton = async () => {
    try {
      await instance.logoutRedirect();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        <Stack direction="row" spacing={3}>
          <ThemeSwitch />
          <Tooltip title="ログアウト">
            <IconButton onClick={onClickLogoutButton}>
              <LogoutIcon sx={{ color: "white" }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
