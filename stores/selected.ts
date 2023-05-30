import { atom } from "jotai";

export enum CHAT_STATUS {
  "original",
  "pending",
  "streaming",
  // "error",
  "done",
}

export const chatStatusStore = atom<CHAT_STATUS>(CHAT_STATUS.original);

export const cannotChat = (status: CHAT_STATUS) =>
  status !== CHAT_STATUS.original && status !== CHAT_STATUS.done;

export const isChatting = (status: CHAT_STATUS) =>
  status === CHAT_STATUS.pending || status === CHAT_STATUS.streaming;
