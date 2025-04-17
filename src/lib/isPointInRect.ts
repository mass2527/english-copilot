import type { Point } from "../types";

export function isPointInRect(rect: DOMRect, point: Point) {
  return (
    rect.left <= point.x &&
    rect.right >= point.x &&
    rect.top <= point.y &&
    rect.bottom >= point.y
  );
}
