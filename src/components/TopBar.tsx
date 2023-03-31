import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useContext } from "react";
import {
  ColorModeContext,
  ColorModeContextType,
} from "../contexts/ColorModeContext";

function TopBar() {
  const { isDarkMode, toggleColorMode } =
    useContext<ColorModeContextType>(ColorModeContext);

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Question Answer Portal
        </Typography>
        <IconButton onClick={() => toggleColorMode()}>
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
