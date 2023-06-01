import { useCallback, useEffect, useRef } from "react";
import { useUnmount } from "react-use";
import { useEvent } from "./useEvent";
import { isBrowser } from "@/utils/predicates";

export function useMutationObserver(
  target: Element | null | undefined,
  callback: MutationCallback,
  options: MutationObserverInit = {
    attributes: true,
    childList: true,
    subtree: true,
  }
) {
  const observer = useRef<MutationObserver | null>(null);

  const stop = useEvent(() => {
    if (!observer.current) return;

    observer.current.disconnect();
    observer.current = null;
  });
  const cb = useEvent(callback);

  useUnmount(stop);

  useEffect(() => {
    if (!target || !isBrowser()) return;
    observer.current = new window.MutationObserver(cb);
    observer.current?.observe(target, options);

    return stop;
  }, [options, target]);

  return {
    stop,
  };
}
