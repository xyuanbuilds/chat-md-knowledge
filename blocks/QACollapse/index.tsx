import React, { memo, useRef, useState, useEffect } from "react";
import { Disclosure } from "@headlessui/react";
import { useAtom } from "jotai";
import { qaStore } from "@/stores/qa";
import MarkdownBox from "@/components/MarkdownBox";
import TriggerModal from "@/components/TriggerModal";
import MarkdownEditor from "@/components/MarkdownEditor/Editor";
import { UserIcon, GPTIcon, EditIcon } from "./icons";
import { useSize } from "react-use";
import { useSpring, animated } from "@react-spring/web";

interface QA {
  /** question */
  Q: string;
  /** answer */
  A: string;
  info?: Record<string, any>;
}

const HeightAnimatedBox: React.FC<
  React.PropsWithChildren<{
    height: number;
  }>
> = memo(({ children, height }) => {
  const springs = useSpring({
    from: { height: 0 },
    to: { height },
  });

  return (
    <animated.div className="overflow-hidden" style={{ ...springs }}>
      {children}
    </animated.div>
  );
});
HeightAnimatedBox.displayName = "HeightAnimatedBox";

const SizedPanel: React.FC<{
  open: boolean;
  children: string;
}> = ({ children, open }) => {
  const [sized, { height }] = useSize(
    <Disclosure.Panel className="pt-2">
      <GPTIcon /> : <MarkdownBox>{children}</MarkdownBox>
    </Disclosure.Panel>
  );

  if (!height || !open) return null;

  return <HeightAnimatedBox height={height}>{sized}</HeightAnimatedBox>;
};

const QACollapse = memo(() => {
  const [{ qa }, setAtom] = useAtom(qaStore);

  const container = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = content.current;

    if (!element) return;

    const handleHeightChange = () => {
      const newHeight = element.clientHeight;
      console.log("height changed:", newHeight, container.current?.scrollTop);
      if (container.current && newHeight > container.current?.scrollTop) {
        container.current.scrollTo({
          top: newHeight,
          // behavior: "smooth",
        });
      }
      // 处理高度变化的操作
    };

    const observer = new MutationObserver(handleHeightChange);
    observer.observe(element, {
      attributes: true,
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [content]);

  const [editingValue, setEditing] = useState("");

  const updateQA = (curId: number, mdStr?: string) => {
    if (!curId) return;
    setAtom((prev) => {
      const { qa } = prev;

      return {
        ...prev,
        qa: qa.map((i) => {
          if (i.id === curId) {
            return {
              ...i,
              mdStr,
            };
          }
          return i;
        }),
      };
    });
  };

  return (
    <div ref={container} className="flex-1 overflow-x-hidden overflow-y-auto">
      <div ref={content} className="flex flex-col items-start gap-1">
        {qa.map((panel) => {
          return (
            <Disclosure
              className="w-full p-1 rounded border border-dashed border-transparent hover:border-gray-500"
              as="div"
              defaultOpen
              key={panel.chunks?.[0]?.id || panel.id}
            >
              {({ open }) => {
                const mdStr =
                  (panel.mdStr ||
                    panel.chunks?.reduce((res, i) => {
                      const content = i.choices[0].delta.content;

                      if (!content) return res;

                      return `${res}${content}`;
                    }, "")) ??
                  "";

                return (
                  <div className="relative">
                    <Disclosure.Button className="w-full text-left text-gray-500">
                      <UserIcon /> : {panel.question}
                    </Disclosure.Button>
                    <SizedPanel open={open}>{mdStr}</SizedPanel>

                    <TriggerModal
                      content={
                        <MarkdownEditor
                          onChange={(v) => {
                            console.log("onchange", v);
                            setEditing(v);
                          }}
                          value={editingValue}
                        />
                      }
                      className="w-[75vw]"
                      onOk={() => {
                        updateQA(panel.id, editingValue);
                        setEditing("");
                      }}
                    >
                      {(open) => (
                        <EditIcon
                          onClick={() => {
                            setEditing(mdStr);
                            open();
                          }}
                          className={`absolute cursor-pointer top-1 right-1`}
                        />
                      )}
                    </TriggerModal>
                  </div>
                );
              }}
            </Disclosure>
          );
        })}
      </div>
    </div>
  );
});
QACollapse.displayName = "QACollapse";

export default QACollapse;
