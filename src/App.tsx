import { useRef } from "react";
import { WordTooltip } from "./components/WordTooltip";
import { useAreKeysPressed } from "./hooks/useAreKeysPressed";
import { useWordDetails } from "./hooks/useWordDetails";
import { isPointInRect } from "./lib/isPointInRect";

export function App() {
  const popoverRef = useRef<HTMLDivElement>(null);
  const isWordTooltipEnabled = useAreKeysPressed(["KeyA", "KeyS"]);
  const { point, wordDetails } = useWordDetails({
    enabled: isWordTooltipEnabled,
    shouldSkip: (event) => {
      const popoverElement = popoverRef.current;

      if (popoverElement === null) {
        return false;
      }

      return isPointInRect(popoverElement.getBoundingClientRect(), {
        x: event.clientX,
        y: event.clientY,
      });
    },
  });

  if (wordDetails === null) {
    return null;
  }

  return <WordTooltip ref={popoverRef} {...wordDetails} point={point} />;
}
