import { useState } from "react";

import { useEffect } from "react";

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

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const isCommandKeyPressed = isMacOS ? event.metaKey : event.ctrlKey;
      if (isCommandKeyPressed) {
        setIsCommandKeyPressed(true);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    function handleKeyUp() {
      setIsCommandKeyPressed(false);
    }

    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return isCommandKeyPressed;
}
