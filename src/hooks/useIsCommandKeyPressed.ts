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

  useWindowEventListener("keydown", (event) => {
    const isCommandKeyPressed = isMacOS ? event.metaKey : event.ctrlKey;
    if (isCommandKeyPressed) {
      setIsCommandKeyPressed(true);
    }
  });

  useWindowEventListener("keyup", () => {
    setIsCommandKeyPressed(false);
  });

  useWindowEventListener("blur", () => {
    setIsCommandKeyPressed(false);
  });

  return isCommandKeyPressed;
}
