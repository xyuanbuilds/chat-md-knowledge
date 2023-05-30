import Image from "next/image";
import { Inter } from "next/font/google";
import ActivityBar from "@/blocks/ActivityBar";
import SideBar from "@/blocks/SideBar";
import { Container } from "@nextui-org/react";
import QuestionBox from "@/blocks/QuestionBox";
import QACollapse from "@/blocks/QACollapse";
import { useAtom } from "jotai";
import { openaiStore } from "@/stores/openai";

const inter = Inter({ subsets: ["latin"] });

const flexDefault = "flex flex-row";

export default function Home() {
  const [{ apiKey }] = useAtom(openaiStore);
  // console.log("home", apiKey, props);
  return (
    <div
      // fluid
      // gap={0}
      className={`relative h-screen border border-solid dark:text-white dark:border-white dark:bg-black rounded ${inter.className}`}
    >
      <ActivityBar
        className={`absolute w-12 border-r dark:border-white border-solid`}
      />
      <main
        className={`${flexDefault} overflow-hidden h-full ml-12 w-[calc(100%-3rem)]`}
      >
        <div className="p-4 flex flex-col flex-1">
          <QACollapse />
          <QuestionBox
          // className="border bg-gray-300 dark:bg-white dark:border-white rounded mt-4 min-h-[1rem] max-h-[30%] flex-initial"
          />
        </div>
        <SideBar className="border-l dark:border-white" />
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const apiKey = process.env.OPENAI_API_KEY;

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      openai: {
        apiKey,
      },
    },
  };
}
