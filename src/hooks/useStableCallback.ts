import { useCallback } from "react";
import { useLatestRef } from "./useLatestRef";

export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T
): (...args: Parameters<T>) => ReturnType<T> {
  const latestCallbackRef = useLatestRef(callback);

  return useCallback((...args: any[]) => {
    return latestCallbackRef.current(...args);
  }, []);
}
