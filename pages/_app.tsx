import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { openaiStore } from "@/stores/openai";

export default function App({ Component, pageProps }: AppProps) {
  const { openai } = pageProps;
  console.log("openai", openai);
  useHydrateAtoms([[openaiStore, openai]]);
  return (
    // <Provider>
    <Component {...pageProps} />
    // </Provider>
  );
}
