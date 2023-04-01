import { atom } from "recoil";

export const titleState = atom<string>({
  key: "title",
  default: "Question Answer Portal",
});
