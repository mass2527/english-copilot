import { useCallback } from "react";
import type { MutableRefObject, RefCallback } from "react";

export function useComposedRef<T extends HTMLElement>(
  ...refs: (RefCallback<T> | MutableRefObject<T | null> | null)[]
) {
  return useCallback(
    (node: T | null) => {
      refs.forEach((ref) => {
        if (ref === null) {
          return;
        }

        if (typeof ref === "function") {
          ref(node);
        } else {
          ref.current = node;
        }
      });
    },
    [refs]
  );
}
