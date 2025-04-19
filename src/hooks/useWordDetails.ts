import { useState } from "react";

import { useLatestRef } from "./useLatestRef";

import { invariant } from "../lib/invariant";
import type { Point, WordDetails } from "../types";
import { isPointInRect } from "../lib/isPointInRect";
import { debounce } from "../lib/debounce";
import { useWindowEventListener } from "./useWindowEventListener";

function findWordAtIndex(text: string, index: number) {
  let startIndex = index;
  while (startIndex > 0 && /\w/.test(text[startIndex - 1] as string)) {
    startIndex--;
  }

  let endIndex = index;
  while (endIndex < text.length && /\w/.test(text[endIndex] as string)) {
    endIndex++;
  }

  const word = text.slice(startIndex, endIndex);

  return word;
}

function findWordAtPointer(node: Node, point: Point) {
  if (node.nodeType === node.TEXT_NODE) {
    const caretPosition = document.caretPositionFromPoint(point.x, point.y);
    invariant(caretPosition !== null);

    const { offsetNode, offset } = caretPosition;

    const text = offsetNode.textContent;
    invariant(text !== null);

    return findWordAtIndex(text, offset);
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
        return findWordAtPointer(childNode, point);
      }
    }
  }

  return null;
}

export function useWordDetails({
  enabled,
  shouldSkip,
}: {
  enabled: boolean;
  shouldSkip?: (event: MouseEvent) => boolean;
}) {
  const [wordDetails, setWordDetails] = useState<WordDetails | null>(null);
  const [point, setPoint] = useState<Point>({ x: 0, y: 0 });
  const latestEnabledRef = useLatestRef(enabled);

  async function handleMouseMove(event: MouseEvent) {
    if (latestEnabledRef.current) {
      if (shouldSkip?.(event)) {
        return;
      }

      const element = document.elementFromPoint(event.clientX, event.clientY);
      if (element === null) return;

      const word = findWordAtPointer(element, {
        x: event.clientX,
        y: event.clientY,
      });

      if (word === null) {
        return;
      }

      const isSameWord = word === wordDetails?.word;
      if (isSameWord) {
        return;
      }

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

  useWindowEventListener("mousemove", debounce(handleMouseMove, 100));

  useWindowEventListener("keyup", () => {
    setWordDetails(null);
  });

  return { wordDetails, point };
}
