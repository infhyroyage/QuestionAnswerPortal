import { isDarkModeState } from "@/services/atoms";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { Switch, Tooltip } from "@mui/material";
import { useRecoilState } from "recoil";

function ThemeSwitch() {
  const [isDarkMode, setIsDarkMode] = useRecoilState<boolean>(isDarkModeState);

  return (
    <Tooltip title={isDarkMode ? "ダーク" : "ライト"}>
      <Switch
        checked={isDarkMode}
        onChange={() => setIsDarkMode(!isDarkMode)}
        icon={<LightModeIcon sx={{ color: "white" }} />}
        checkedIcon={<DarkModeIcon sx={{ color: "white" }} />}
        sx={{
          width: 58,
          height: 38,
          padding: 0,
          "& .MuiSwitch-switchBase": {
            padding: 0,
            margin: "7px",
          },
          "& .MuiSwitch-track": {
            borderRadius: 38 / 2,
          },
        }}
      />
    </Tooltip>
  );
}

export default ThemeSwitch;
