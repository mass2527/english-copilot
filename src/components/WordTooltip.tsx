import { forwardRef, useRef, useState, type CSSProperties } from "react";

import type { WordDetails } from "../types";
import { invariant } from "../lib/invariant";
import { ExternalLinkIcon, SearchIcon } from "lucide-react";
import { SpeakerIcon } from "./SpeakerIcon";
import { GoogleIcon } from "./GoogleIcon";
import { useAudioEventListener } from "../hooks/useAudioEventListener";

type Pronunciation = WordDetails["pronunciations"][number];
type Accent = Pronunciation["accent"];

export const WordTooltip = forwardRef<
  HTMLDivElement,
  WordDetails & { style: CSSProperties }
>(function ({ style, ...word }, ref) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playingAccent, setPlayingAccent] = useState<"none" | Accent>("none");
  const hasDefinitions = word.definitions.length > 0;

  const playPronunciation = (pronunciation: Pronunciation) => {
    const audioElement = audioRef.current;
    invariant(audioElement !== null);
    audioElement.src = pronunciation.href;

    setPlayingAccent(pronunciation.accent);
    audioElement.play();
  };

  useAudioEventListener(audioRef, "ended", () => {
    setPlayingAccent("none");
  });

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        transform: "translateX(-50%)",
        width: "320px",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderRadius: "6px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        zIndex: 1000,
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(0, 0, 0, 0.06)",
        fontSize: "16px",
        color: "#000",
        ...style,
      }}
    >
      <audio ref={audioRef} />

      {hasDefinitions ? (
        <>
          <div
            style={{
              padding: "16px",
              borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
            }}
          >
            <h3
              style={{
                fontSize: "20px",
                fontWeight: 700,
                margin: "0 0 8px 0",
                color: hasDefinitions ? "#007AFF" : "#000",
              }}
            >
              <a
                href={`https://dic.daum.net/search.do?q=${word.word}&dic=eng&search_first=Y`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {word.word}
                <ExternalLinkIcon size={16} />
              </a>
            </h3>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                fontSize: "14px",
              }}
            >
              {word.pronunciations.map((pronunciation) => {
                const label = { american: "미국", british: "영국" }[
                  pronunciation.accent
                ];
                return (
                  <div
                    key={pronunciation.href}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <span
                      style={{
                        backgroundColor: "rgba(88, 86, 214, 0.1)",
                        borderRadius: "4px",
                        padding: "2px 8px",
                        color: "#5856D6",
                        fontWeight: 500,
                        marginRight: "6px",
                      }}
                    >
                      {label}:{" "}
                      <span style={{ fontStyle: "italic" }}>
                        {pronunciation.symbol}
                      </span>
                    </span>
                    <button
                      onClick={() => playPronunciation(pronunciation)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        transition: "background-color 0.2s ease",
                        padding: 0,
                      }}
                      aria-label="Play pronunciation"
                    >
                      <SpeakerIcon
                        isPlaying={pronunciation.accent === playingAccent}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            style={{
              overflowY: "auto",
              overscrollBehaviorY: "contain",
              maxHeight: "300px",
              padding: "16px",
            }}
          >
            <ol
              style={{
                lineHeight: "1.5",
                marginBottom: "12px",
                listStyle: "decimal",
                listStylePosition: "inside",
              }}
            >
              {word.definitions.map((definition) => {
                return <li key={definition}>{definition}</li>;
              })}
            </ol>

            {word.examples.slice(0, 1).map((example) => {
              return (
                <div
                  key={example.sentence}
                  style={{
                    padding: "8px 0 0 0",
                    borderTop: "1px solid rgba(0, 0, 0, 0.06)",
                  }}
                >
                  <p>{example.sentence}</p>
                  <p style={{ color: "rgba(0,0,0,0.6)", fontSize: "14px" }}>
                    {example.translation}
                  </p>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <NoDefinitionsFound {...word} />
      )}
    </div>
  );
});

function NoDefinitionsFound({ word }: WordDetails) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px 0",
        gap: "12px",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          backgroundColor: "rgba(0, 122, 255, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SearchIcon />
      </div>
      <div
        style={{
          fontSize: "14px",
          color: "#666",
          textAlign: "center",
        }}
      >
        <p style={{ margin: "0 0 8px 0" }}>
          "{word}"에 대한 정보를 찾을 수 없습니다.
        </p>
      </div>
      <a
        href={`https://www.google.com/search?q=${word}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          backgroundColor: "#007AFF",
          color: "white",
          border: "none",
          borderRadius: "8px",
          padding: "8px 16px",
          fontSize: "14px",
          fontWeight: 500,
          cursor: "pointer",
          transition: "background-color 0.2s ease",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0062CC")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#007AFF")}
      >
        <GoogleIcon /> Google에서 검색
      </a>
    </div>
  );
}
