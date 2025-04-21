import { useCallback } from "react";
import { useLatestRef } from "./useLatestRef";

// biome-ignore lint/suspicious/noExplicitAny:
export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T
): (...args: Parameters<T>) => ReturnType<T> {
  const latestCallbackRef = useLatestRef(callback);

  return useCallback(
    (...args: Parameters<T>) => {
      return latestCallbackRef.current(...args);
    },
    [latestCallbackRef]
  );
}
