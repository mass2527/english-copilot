// biome-ignore lint/suspicious/noExplicitAny:
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  ms: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
    }, ms);
  };
}
