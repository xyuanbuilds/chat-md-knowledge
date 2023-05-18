export const isFn = <Arg extends Array<unknown>, R = void>(
  v: unknown
): v is (...args: Arg) => R => typeof v === "function";
