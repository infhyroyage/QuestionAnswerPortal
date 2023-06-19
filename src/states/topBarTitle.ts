import { atom } from "recoil";

export const topBarTitleState = atom<string>({
  key: "topBarTitle",
  default: "Question Answer Portal",
});
