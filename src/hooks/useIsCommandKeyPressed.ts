import { useState } from "react";

import { useWindowEventListener } from "./useWindowEventListener";

declare global {
  interface Navigator {
    userAgentData: {
      platform: string;
    };
  }
}

const isMacOS = navigator.userAgentData.platform === "macOS";

export function useIsCommandKeyPressed() {
  const [isCommandKeyPressed, setIsCommandKeyPressed] = useState(false);

  function handleKeyDown(event: KeyboardEvent) {
    const isCommandKeyPressed = isMacOS ? event.metaKey : event.ctrlKey;
    if (isCommandKeyPressed) {
      setIsCommandKeyPressed(true);
    }
  }
  useWindowEventListener("keydown", handleKeyDown);

  function handleKeyUp() {
    setIsCommandKeyPressed(false);
  }
  useWindowEventListener("keyup", handleKeyUp);

  return isCommandKeyPressed;
}
