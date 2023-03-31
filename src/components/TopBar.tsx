import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useRecoilState } from "recoil";
import { isDarkModeState } from "@/states/coler";

function TopBar() {
  const [isDarkMode, setIsDarkMode] = useRecoilState<boolean>(isDarkModeState);

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Question Answer Portal
        </Typography>
        <IconButton onClick={() => setIsDarkMode(!isDarkMode)}>
          {isDarkMode ? (
            <DarkModeIcon sx={{ color: "white" }} />
          ) : (
            <LightModeIcon sx={{ color: "white" }} />
          )}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
