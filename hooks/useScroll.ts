import * as React from "react";
import { useEvent } from "./useEvent";

interface ScrollInfo {
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
}

interface ScrollHelpState {
  isScrollBottom: boolean;
  needScroll: boolean;
}

const isScrollBottom = (scrollInfo: ScrollInfo) => {
  if (Object.keys(scrollInfo).length === 0) return false;
  const { scrollHeight, scrollTop, clientHeight } = scrollInfo as ScrollInfo;

  const res =
    scrollHeight !== undefined &&
    clientHeight !== undefined &&
    scrollTop === scrollHeight - clientHeight;

  return res;
};

const needScroll = (scrollInfo: ScrollInfo) => {
  if (Object.keys(scrollInfo).length === 0) return false;
  const { scrollHeight, scrollTop, clientHeight } = scrollInfo as ScrollInfo;
  const res =
    scrollHeight !== undefined &&
    clientHeight !== undefined &&
    scrollHeight > clientHeight;

  return res;
};

export const useScrollInfo = (
  target: Element | null | undefined,
  onScroll?: (scrollInfo: ScrollInfo & ScrollHelpState) => void
) => {
  const scrollInfo = React.useRef<ScrollInfo | {}>({});
  const cb = useEvent(onScroll);

  React.useEffect(() => {
    if (!target) return;
    const eventCallback = () => {
      const res = {
        scrollTop: target.scrollTop,
        scrollHeight: target.scrollHeight,
        clientHeight: target.clientHeight,
      };
      scrollInfo.current = res;
      cb?.({
        ...res,
        isScrollBottom: isScrollBottom(res),
        needScroll: needScroll(res),
      });
      //   scrollInfoRef.current = ;
    };
    target?.addEventListener("scroll", eventCallback);

    return () => {
      target?.removeEventListener("scroll", eventCallback);
    };
  }, [target]);

  return [scrollInfo.current] as const;
};
