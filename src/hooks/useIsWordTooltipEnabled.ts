import { useState } from "react";
import { useWindowEventListener } from "./useWindowEventListener";

export function useIsWordTooltipEnabled() {
  const [isWordTooltipEnabled, setIsWordTooltipEnabled] = useState(false);

  useWindowEventListener("keydown", (event) => {
    if (event.altKey && event.code === "KeyZ") {
      setIsWordTooltipEnabled(true);
    }
  });

  useWindowEventListener("keyup", () => {
    setIsWordTooltipEnabled(false);
  });

  useWindowEventListener("blur", () => {
    setIsWordTooltipEnabled(false);
  });

  return isWordTooltipEnabled;
}
