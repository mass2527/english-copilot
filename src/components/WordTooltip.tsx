import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Volume2 } from "lucide-react";
import { useRef, type CSSProperties } from "react";
import type { WordDetails } from "../App";
import { invariant } from "../lib/invariant";

export function WordTooltip({
  style,
  ...word
}: WordDetails & { style: CSSProperties }) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const playAudio = (href: string) => {
    const audioElement = audioRef.current;
    invariant(audioElement !== null);
    audioElement.src = href;
    audioElement.play().catch(console.error);
  };

  return (
    <PopoverPrimitive.Root open>
      <PopoverPrimitive.Content
        style={{
          position: "absolute",
          width: "280px",
          backgroundColor: "#ffffff",
          borderRadius: "4px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          ...style,
        }}
        align="start"
      >
        <div style={{ padding: "12px" }}>
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: 500,
              margin: "0 0 8px 0",
              color: "#000000",
            }}
          >
            {word.word}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {word.pronunciations.map((pron, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span style={{ fontSize: "0.75rem", color: "#374151" }}>
                  {pron.accent}
                </span>
                <span style={{ fontSize: "0.875rem", color: "#374151" }}>
                  {pron.symbol}
                </span>
                {pron.href && (
                  <button
                    type="button"
                    onClick={() => playAudio(pron.href)}
                    style={{
                      padding: "4px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#374151",
                    }}
                  >
                    <Volume2 size={14} />
                    <span
                      style={{
                        position: "absolute",
                        width: "1px",
                        height: "1px",
                        padding: 0,
                        margin: "-1px",
                        overflow: "hidden",
                        clip: "rect(0, 0, 0, 0)",
                        whiteSpace: "nowrap",
                        borderWidth: 0,
                      }}
                    >
                      Play {pron.accent} pronunciation
                    </span>
                  </button>
                )}
              </div>
            ))}
            <audio ref={audioRef} />
          </div>

          {word.examples.length > 0 && (
            <div style={{ marginTop: "12px" }}>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                {word.examples.map((example, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    <p style={{ fontSize: "0.875rem", color: "#000000" }}>
                      {example.text}
                    </p>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "#374151",
                        fontStyle: "italic",
                      }}
                    >
                      {example.meaning}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Root>
  );
}
