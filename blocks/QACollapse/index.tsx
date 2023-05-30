import React, { memo, useRef, useState, useEffect } from "react";
import { Disclosure } from "@headlessui/react";
import { useAtom } from "jotai";
import { qaStore, selectedAaStore } from "@/stores/qa";
import type { QA } from "@/stores/qa";
import MarkdownBox from "@/components/MarkdownBox";
import TriggerModal from "@/components/TriggerModal";
import MarkdownEditor from "@/components/MarkdownEditor/Editor";
import { UserIcon, GPTIcon, EditIcon } from "./icons";
import { useSize } from "react-use";
import { useSpring, animated } from "@react-spring/web";
import { CHAT_STATUS, chatStatusStore, isChatting } from "@/stores/status";
import { Loading } from "@nextui-org/react";
import clsx from "clsx";
import styles from "./index.module.css";

// interface QA {
//   /** question */
//   Q: string;
//   /** answer */
//   A: string;
//   info?: Record<string, any>;
// }

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
  loading?: boolean;
}> = ({ children, open, loading }) => {
  const [sized, { height }] = useSize(
    <Disclosure.Panel className="pt-2">
      <GPTIcon /> :{" "}
      {loading && (
        <Loading
          className="ml-1 align-middle"
          type="points-opacity"
          size="sm"
        />
      )}
      <MarkdownBox>{children}</MarkdownBox>
    </Disclosure.Panel>
  );

  if (!height || !open) return null;

  return <HeightAnimatedBox height={height}>{sized}</HeightAnimatedBox>;
};

const QACollapse = memo(() => {
  const [{ qa }, setAtom] = useAtom(qaStore);
  const [chatStatus] = useAtom(chatStatusStore);
  const [selectedId, setSelected] = useAtom(selectedAaStore);

  const container = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = content.current;
    const scrollBox = container.current;

    if (!element) return;

    const handleHeightChange = () => {
      const newHeight = element.clientHeight;
      if (
        scrollBox &&
        newHeight > scrollBox?.scrollTop &&
        isChatting(chatStatus)
      ) {
        scrollBox.scrollTo({
          top: newHeight,
        });
      }
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
  }, [content, chatStatus]);

  const [editingValue, setEditing] = useState("");

  const updateQA = (curId: number, updater: QA) => {
    if (!curId) return;
    setAtom(({ qa }) => {
      return {
        qa: qa.map((i) =>
          i.id === curId
            ? {
                ...i,
                ...updater,
              }
            : i
        ),
      };
    });
  };

  const updateQAMd = (curId: number, mdStr?: string) => {
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

  const selectQA = (qaId: number) => {
    if (qaId) {
      setSelected(selectedId === qaId ? null : qaId);
    }
  };

  // width: 100%;
  // bottom: 0;
  // left: 0;
  // height: 2rem;
  // position: absolute;
  // background-image: linear-gradient(-180deg,rgba(255,255,255,0) 0%,#fff 100%);

  return (
    <div
      className={`${styles["scroll_container"]} relative flex-1 overflow-hidden`}
    >
      {/* TODO scroll bottom remove */}
      <div className={styles.mask}></div>
      <div ref={container} className="h-full overflow-x-hidden overflow-y-auto">
        <div ref={content} className="flex flex-col items-start gap-1">
          {qa.map((panel, index) => {
            return (
              <Disclosure
                className={clsx(
                  "w-full p-1 rounded border border-transparent hover:border-dashed hover:border-gray-500 selection:border-solid selection:border-gray-500"
                )}
                aria-selected={panel.id === selectedId}
                style={
                  panel.id === selectedId
                    ? {
                        borderStyle: "solid",
                        borderColor: `rgb(107 114 128 / var(--tw-border-opacity))`,
                      }
                    : {}
                }
                as="div"
                defaultOpen
                key={panel.chunks?.[0]?.id || panel.id}
                onClick={() => {
                  console.log("click", panel);
                  selectQA(panel.id);
                }}
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
                      <Disclosure.Button
                        onClick={(e) => e.stopPropagation()}
                        className="text-left text-gray-500"
                      >
                        <UserIcon /> : {panel.question}
                      </Disclosure.Button>
                      <SizedPanel
                        loading={
                          isChatting(chatStatus) && index === qa.length - 1
                        }
                        open={open}
                      >
                        {mdStr}
                      </SizedPanel>

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
                          updateQAMd(panel.id, editingValue);
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
    </div>
  );
});
QACollapse.displayName = "QACollapse";

export default QACollapse;
