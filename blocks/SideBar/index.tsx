import * as React from "react";
// import { Button } from "@/components/Buttons";
import { Button } from "@nextui-org/react";
import cls from "clsx";
import { useAtom } from "jotai";
import { qaStore, selectedAaStore } from "@/stores/qa";
import { chatKeywordsFetch } from "@/utils/chat/fetch";
import { openaiStore } from "@/stores/openai";
import HoverBadge from "@/components/HoverBadge";

const DownloadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-4 h-4 mr-2 inline-block"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
    />
  </svg>
);

const buttonPosCls = "absolute left-0 right-0 mx-auto bottom-6";

const buttonBaseCls =
  "text-ellipsis overflow-hidden max-w-fit whitespace-nowrap inline-block";

const SideBar = ({ className }: { className?: string }) => {
  const [keysWordsMap, setKeyWords] = React.useState<Record<number, string[]>>(
    {}
  );
  const [selected] = useAtom(selectedAaStore);
  const [{ qa }] = useAtom(qaStore);
  const [{ apiKey }] = useAtom(openaiStore);
  const curQA = qa.find((i) => i.id === selected);

  const curContent =
    curQA?.chunks?.reduce((res, i) => {
      const content = i.choices[0].delta.content;

      if (!content) return res;

      return `${res}${content}`;
    }, "") ?? "";

  return (
    <div className={cls("w-1/5 h=full p-4 relative", className)}>
      <div>{curQA?.id}</div>
      <div className="inline-flex gap-1 my-2 flex-wrap">
        {selected &&
          keysWordsMap[selected]?.map((i) => (
            <HoverBadge
              key={i}
              onClose={(tag) => {
                setKeyWords((prev) => {
                  return {
                    ...prev,
                    [selected]: prev[selected].filter((i) => i !== tag),
                  };
                });
              }}
            >
              {i}
            </HoverBadge>
          ))}
      </div>
      <Button
        size="xs"
        disabled={!selected}
        onClick={() =>
          selected &&
          chatKeywordsFetch(
            `extract less than ten keywords from this content, return a string separate keywords with \`,\`:
            ${curContent}`,
            apiKey,
            {
              onDone: (res) => {
                console.log(res.choices[0].message.content);
                setKeyWords((prev) => ({
                  ...prev,
                  [selected]: res.choices[0].message.content
                    .split(",")
                    .map((i) => i.trim()),
                }));
              },
            }
          )
        }
      >
        get key words
      </Button>
      {/* <div className="absolute bottom-4 left-[calc(50%-25%);] w-1/2 h-0 pb-[30.9%]"> */}
      <Button
        color="gradient"
        auto
        shadow
        icon={<DownloadIcon />}
        style={{ position: "absolute" }}
        className={`${buttonPosCls} ${buttonBaseCls}`}
      >
        Download
      </Button>
      {/* </div> */}
    </div>
  );
};

export default SideBar;
