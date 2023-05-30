import { atom } from "jotai";

export enum QUESTION_STATUS {
  PENDING,
  STREAMING,
  DONE,
  ERROR,
}

type Delta = { role?: "assistant" } | { content?: string };
export interface QA {
  question: string;
  id: number;
  chunks?: {
    choices: {
      /** remove role delta */
      delta: { content?: string };
    }[];
    /** "gpt-3.5-turbo-0301" */
    model: string;
    index: number;
    /** chatcmpl-xxxxxx */
    id: string;
    /** "chat.completion.chunk" */
    object: string;
    /** 1684427351 */
    created: number;
    finish_reason: "stop" | null;
  }[];
  /** 编辑后产生的 md 字符串 */
  mdStr?: string;
  // TODO
  status?: QUESTION_STATUS;
  tags?: string[];
}

export const qaStore = atom<{
  qa: QA[];
}>({
  qa: [],
});
export const selectedAaStore = atom<number | null>(null);
