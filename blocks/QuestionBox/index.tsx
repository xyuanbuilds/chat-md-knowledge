import cls from "clsx";
import chatFetch from "@/utils/chat/fetch";
import { useState } from "react";
import { useAtom } from "jotai";
import { qaStore } from "@/stores/qa";
import { openaiStore } from "@/stores/openai";

const QuestionBox = ({ className }: { className?: string }) => {
  const [question, setQues] = useState("");
  const [{ apiKey }] = useAtom(openaiStore);
  const [qa, setAtom] = useAtom(qaStore);

  const addQA = (id: number) => {
    setAtom((prev) => {
      const { qa } = prev;

      return {
        ...prev,
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
        ...prev,
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
      apiKey
    );
  };

  return (
    <div
      className={cls(
        "flex flex-col justify-center items-center overflow-x-hidden overflow-y-auto",
        className
      )}
    >
      <textarea
        value={question}
        onKeyDownCapture={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            const id = Date.now();
            addQA(id);
            chat(id);
          }
        }}
        onChange={(e) => setQues(e.target.value)}
        className="outline-none h-full w-full min-h-[1.3rem]"
        style={{ color: "red" }}
      />
    </div>
  );
};

export default QuestionBox;
