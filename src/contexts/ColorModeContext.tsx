import { createContext } from "react";

export type ColorModeContextType = {
  isDarkMode: boolean;
  toggleColorMode: () => void;
};

export const ColorModeContext = createContext<ColorModeContextType>({
  isDarkMode: false,
  toggleColorMode: () => {},
});
