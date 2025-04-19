import { useEffect } from "react";
import { useStableCallback } from "./useStableCallback";

export function useWindowEventListener<T extends keyof WindowEventMap>(
  type: T,
  listener: (event: WindowEventMap[T]) => void,
  options?: boolean | AddEventListenerOptions
) {
  const stableListener = useStableCallback(listener);

  useEffect(() => {
    window.addEventListener(type, stableListener, options);
    return () => {
      window.removeEventListener(type, stableListener, options);
    };
  }, [stableListener]);
}
