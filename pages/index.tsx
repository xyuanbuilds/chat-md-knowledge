import Image from "next/image";
import { Inter } from "next/font/google";
import ActivityBar from "@/blocks/ActivityBar";
import SideBar from "@/blocks/SideBar";
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
      className={`relative container h-screen border border-solid border-white rounded ${inter.className}`}
    >
      <ActivityBar
        className={`absolute w-12 border-r border-white border-solid`}
      />
      <main
        className={`${flexDefault} overflow-hidden h-full ml-12 w-[calc(100%-2.5rem)] xl:w-[calc(100%-2.5rem)] md:w-[calc(100%-2rem)]`}
      >
        <div className="p-4 flex flex-col flex-1">
          <div className="flex-1 overflow-x-hidden overflow-y-auto">
            <QACollapse />
          </div>
          <QuestionBox className="border bg-white border-white rounded mt-4 min-h-[1rem] max-h-[30%] flex-initial" />
        </div>
        <SideBar className="border-l border-white" />
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
