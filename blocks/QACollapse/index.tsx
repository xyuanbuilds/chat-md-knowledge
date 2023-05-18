import React, { memo } from "react";
import { Disclosure, Transition } from "@headlessui/react";
import { useAtom } from "jotai";
import { qaStore } from "@/stores/qa";
import MarkdownBox from "@/components/MarkdownBox";
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
  const [{ qa }] = useAtom(qaStore);

  return (
    <div className="flex flex-col items-start gap-1">
      {qa.map((panel) => (
        <Disclosure
          className="w-full p-1 rounded border border-dashed border-transparent hover:border-gray-500"
          as="div"
          defaultOpen
          key={panel.chunks?.[0]?.id || panel.id}
        >
          {({ open }) => {
            const mdStr =
              panel.chunks?.reduce((res, i) => {
                const content = i.choices[0].delta.content;

                if (!content) return res;

                return `${res}${content}`;
              }, "") ?? "";

            return (
              <div className="relative">
                <Disclosure.Button className="w-full text-left text-gray-500">
                  <UserIcon /> : {panel.question}
                </Disclosure.Button>
                <SizedPanel open={open}>{mdStr}</SizedPanel>
                <EditIcon className={`absolute cursor-pointer top-1 right-1`} />
              </div>
            );
          }}
        </Disclosure>
      ))}
    </div>
  );
});
QACollapse.displayName = "QACollapse";

export default QACollapse;
