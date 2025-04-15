import { useEffect, useRef, useState } from "react";
import { debounce } from "./lib/debounce";
import { invariant } from "./lib/invariant";
import { useLatestRef } from "./hooks/useLatestRef";
import { WordTooltip } from "./components/WordTooltip";

type Point = {
  x: number;
  y: number;
};

function isPointInRect(rect: DOMRect, point: Point) {
  return (
    rect.left <= point.x &&
    rect.right >= point.x &&
    rect.top <= point.y &&
    rect.bottom >= point.y
  );
}

function findWordAtOffset(text: string, offset: number) {
  let startIndex = offset;
  while (startIndex > 0 && /\w/.test(text[startIndex - 1] as string)) {
    startIndex--;
  }

  let endIndex = offset;
  while (endIndex < text.length && /\w/.test(text[endIndex] as string)) {
    endIndex++;
  }

  const word = text.slice(startIndex, endIndex);

  return word;
}

function findWord(node: Node, point: Point) {
  if (node.nodeType === node.TEXT_NODE) {
    const caretPosition = document.caretPositionFromPoint(point.x, point.y);
    invariant(caretPosition !== null);

    const { offsetNode, offset } = caretPosition;

    const text = offsetNode.textContent;
    invariant(text !== null);

    return findWordAtOffset(text, offset);
  } else {
    for (let i = 0; i < node.childNodes.length; i++) {
      const childNode = node.childNodes[i];
      invariant(childNode !== undefined);

      const document = childNode?.ownerDocument;
      invariant(document instanceof Document);

      const range = document.createRange();
      range.selectNodeContents(childNode);
      const rect = range.getBoundingClientRect();

      if (isPointInRect(rect, point)) {
        return findWord(childNode, point);
      }
    }
  }

  return null;
}

export type WordDetails = {
  word: string;
  definitions: string[];
  pronunciations: {
    accent: "american" | "british";
    symbol: string;
    href: string;
  }[];
  examples: { text: string; meaning: string }[];
};

function useIsMetaKeyPressed() {
  const [isMetaKeyPressed, setIsMetaKeyPressed] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Meta") {
        setIsMetaKeyPressed(true);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    function handleKeyUp() {
      setIsMetaKeyPressed(false);
    }

    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return isMetaKeyPressed;
}

function useWordDetails({
  enabled,
  shouldSkip,
}: {
  enabled: boolean;
  shouldSkip?: (event: MouseEvent) => boolean;
}) {
  const [wordDetails, setWordDetails] = useState<WordDetails | null>(null);
  const [point, setPoint] = useState<Point>({ x: 0, y: 0 });
  const latestEnabledRef = useLatestRef(enabled);

  useEffect(() => {
    async function handleMouseMove(event: MouseEvent) {
      if (latestEnabledRef.current) {
        if (shouldSkip?.(event)) {
          return;
        }

        const element = document.elementFromPoint(event.clientX, event.clientY);
        if (element === null) return;

        const word = findWord(element, {
          x: event.clientX,
          y: event.clientY,
        });

        if (word === null || word === "") return;

        const response = await chrome.runtime.sendMessage({
          data: word.toLowerCase(),
        });
        setWordDetails(response);
        const elementFontSize = parseInt(getComputedStyle(element).fontSize);

        setPoint({
          x: event.clientX + window.scrollX,
          y: event.clientY + elementFontSize,
        });
      }
    }

    const debouncedHandleMouseMove = debounce(handleMouseMove, 100);

    window.addEventListener("mousemove", debouncedHandleMouseMove);

    return () => {
      window.removeEventListener("mousemove", debouncedHandleMouseMove);
    };
  }, []);

  useEffect(() => {
    function handleKeyUp() {
      setWordDetails(null);
    }

    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return { wordDetails, point };
}

export function App() {
  const popoverRef = useRef<HTMLDivElement>(null);
  const isMetaKeyPressed = useIsMetaKeyPressed();
  const { point, wordDetails } = useWordDetails({
    enabled: isMetaKeyPressed,
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
    <WordTooltip {...wordDetails} style={{ top: point.y, left: point.x }} />
  );
}
