import { useLayoutEffect, useState, type RefObject } from "react";
import { clamp } from "../lib/clamp";
import type { Point } from "../types";

export function usePopoverPosition(
  popoverRef: RefObject<HTMLElement>,
  point: Point,
  options: {
    padding: number;
    horizontalAlignment: "start" | "center" | "end";
  } = {
    padding: 16,
    horizontalAlignment: "center",
  }
) {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const { padding, horizontalAlignment } = options;

  useLayoutEffect(() => {
    const popoverElement = popoverRef.current;

    if (popoverElement === null) {
      return;
    }

    const overflowHeight =
      point.y + popoverElement.offsetHeight - window.innerHeight;
    const hasOverflowHeight = overflowHeight > 0;
    const maxTop = window.innerHeight - popoverElement.offsetHeight - padding;
    const top =
      window.scrollY +
      clamp(
        padding,
        point.y + (hasOverflowHeight ? -overflowHeight : 0),
        maxTop
      );

    const horizontalOffset =
      popoverElement.offsetWidth *
      {
        start: 1,
        center: 1 / 2,
        end: 0,
      }[horizontalAlignment];
    const overflowWidth = point.x + horizontalOffset - window.innerWidth;
    const hasOverflowWidth = overflowWidth > 0;
    const maxLeft = window.innerWidth - horizontalOffset - padding;
    const left =
      window.scrollX +
      clamp(
        padding + horizontalOffset,
        point.x + (hasOverflowWidth ? -overflowWidth : 0),
        maxLeft
      );

    setPosition({
      top,
      left,
    });
  }, [point]);

  return position;
}
