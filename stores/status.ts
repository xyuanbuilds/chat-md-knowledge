import { atom } from "jotai";

export enum CHAT_STATUS {
  "original",
  "pending",
  "streaming",
  "error",
  "done",
}

export const chatStatusStore = atom<CHAT_STATUS>(CHAT_STATUS.original);
