import { useState } from "react";
import { useWindowEventListener } from "./useWindowEventListener";

export function useAreKeysPressed(keys: string[]) {
  const [pressedKeys, setPressedKeys] = useState(new Set<string>());

  useWindowEventListener("keydown", (event) => {
    setPressedKeys((prev) => new Set(prev).add(event.code));
  });

  useWindowEventListener("keyup", (event) => {
    setPressedKeys((prev) => {
      const next = new Set(prev);
      next.delete(event.code);
      return next;
    });
  });

  useWindowEventListener("blur", () => {
    setPressedKeys(new Set());
  });

  return keys.every((key) => pressedKeys.has(key));
}
