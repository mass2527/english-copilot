import { useRef } from "react";
import { WordTooltip } from "./components/WordTooltip";
import { useIsCommandKeyPressed } from "./hooks/useIsCommandKeyPressed";
import { useWordDetails } from "./hooks/useWordDetails";
import { isPointInRect } from "./lib/isPointInRect";

export function App() {
  const popoverRef = useRef<HTMLDivElement>(null);
  const isCommandKeyPressed = useIsCommandKeyPressed();
  const { point, wordDetails } = useWordDetails({
    enabled: isCommandKeyPressed,
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

  return (
    <WordTooltip
      {...wordDetails}
      style={{ top: point.y + window.scrollY, left: point.x + window.scrollX }}
    />
  );
}
