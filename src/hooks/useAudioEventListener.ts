import { useEffect, type RefObject } from "react";
import { invariant } from "../lib/invariant";
import { useStableCallback } from "./useStableCallback";

export function useAudioEventListener<T extends keyof HTMLMediaElementEventMap>(
  audioRef: RefObject<HTMLAudioElement>,
  type: T,
  listener: (event: HTMLMediaElementEventMap[T]) => any,
  options?: boolean | AddEventListenerOptions
) {
  const stableListener = useStableCallback(listener);

  useEffect(() => {
    const audioElement = audioRef.current;
    invariant(audioElement !== null);

    audioElement.addEventListener(type, stableListener, options);
    return () => {
      audioElement.removeEventListener(type, stableListener, options);
    };
  }, [stableListener]);
}
