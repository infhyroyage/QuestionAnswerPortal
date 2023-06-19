import { atom } from "recoil";

export const backdropImageSrcState = atom<string>({
  key: "backdropImageSrc",
  default: "",
});

export const isDarkModeState = atom<boolean>({
  key: "isDarkMode",
  default: false,
});

export const isShownSystemErrorSnackbarState = atom<boolean>({
  key: "isShownSystemErrorSnackbar",
  default: false,
});

export const topBarTitleState = atom<string>({
  key: "topBarTitle",
  default: "Question Answer Portal",
});
