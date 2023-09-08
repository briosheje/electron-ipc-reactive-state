export const throttle = <TFunc extends (...args: unknown[]) => void>(
  action: TFunc,
  ms: number
) => {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<TFunc>) => {
    if (timeout !== void 0) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      action(...args);
    }, ms);
  };
};
