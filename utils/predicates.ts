export const isFn = <Arg extends Array<unknown>, R = void>(
  v: unknown
): v is (...args: Arg) => R => typeof v === "function";

type NonUndefined<T> = T extends undefined ? never : T;
export const isNoUndefined = <T>(v: T | undefined): v is NonUndefined<T> =>
  v !== undefined;

export const isWindow = (v: unknown): v is Window =>
  typeof window !== "undefined" && toString.call(v) === "[object Window]";

export const isBrowser = () => typeof window !== "undefined";
