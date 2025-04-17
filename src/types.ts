export type Point = {
  x: number;
  y: number;
};

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
