import type { AppProps } from "next/app";
import { useHydrateAtoms } from "jotai/utils";
import { NextUIProvider } from "@nextui-org/react";
import { openaiStore } from "@/stores/openai";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const { openai } = pageProps;

  useHydrateAtoms([[openaiStore, openai]]);
  return (
    <NextUIProvider>
      <Component {...pageProps} />
    </NextUIProvider>
  );
}
