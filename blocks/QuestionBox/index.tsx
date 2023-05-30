import cls from "clsx";
import chatFetch from "@/utils/chat/fetch";
import { useState } from "react";
import { Textarea } from "@nextui-org/react";
import { useAtom } from "jotai";
import { qaStore } from "@/stores/qa";
import { CHAT_STATUS, chatStatusStore, cannotChat } from "@/stores/status";
import { openaiStore } from "@/stores/openai";
import { useEvent } from "@/hooks";

const QuestionBox = ({ className }: { className?: string }) => {
  const [question, setQues] = useState("");
  const [{ apiKey }] = useAtom(openaiStore);
  const [_, setAtom] = useAtom(qaStore);
  const [chatStatus, setChatStatus] = useAtom(chatStatusStore);

  const addQA = (id: number) => {
    setAtom((prev) => {
      const { qa } = prev;

      return {
        qa: qa.concat([
          {
            id,
            question,
          },
        ]),
      };
    });
  };
  const updateQA = (curId: number, newChunks: any[]) => {
    setAtom((prev) => {
      const { qa } = prev;

      return {
        qa: qa.map((i) => {
          if (i.id === curId) {
            const preChunks = i.chunks ?? [];

            return {
              ...i,
              chunks: preChunks.concat(newChunks),
            };
          }
          return i;
        }),
      };
    });
  };

  const chat = (curId: number) => {
    chatFetch(
      question,
      (chunks) => {
        console.log("get chunks", chunks);
        updateQA(curId, chunks);
      },
      apiKey,
      {
        onStart: () => setChatStatus(CHAT_STATUS.pending),
        onSteaming: () => setChatStatus(CHAT_STATUS.streaming),
        onDone: () => setChatStatus(CHAT_STATUS.done),
        onError: (error) => window.alert(error),
        onFinally: () => setChatStatus(CHAT_STATUS.original),
      }
    );
  };

  const textOnChange = useEvent((e: { target: { value: string } }) => {
    setQues(e.target.value);
  });

  return (
    <div
      className={cls(
        "flex pt-8 flex-col justify-center items-center",
        className
      )}
    >
      <Textarea
        disabled={cannotChat(chatStatus)}
        onKeyDownCapture={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            const id = Date.now();
            addQA(id);
            chat(id);
          }
        }}
        color="primary"
        // bordered
        labelPlaceholder="tab question here"
        fullWidth
        onChange={textOnChange}
        className="text-[#334155] h-full min-h-[1.3rem]"
      />
    </div>
  );
};

export default QuestionBox;
