import { atom } from "recoil";

export const backdropImageSrcState = atom<string>({
  key: "backdropImageSrc",
  default: "",
});
