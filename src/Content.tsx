import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

const fontUrl = chrome.runtime.getURL("static/fonts/");

const container = document.createElement("div");
document.body.appendChild(container);
const style2 = document.createElement("style");
style2.textContent = `
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('${fontUrl}Inter-Regular.woff2') format('woff2');
}

@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url('${fontUrl}Inter-Medium.woff2') format('woff2');
}

@font-face {
  font-family: 'Inter';
  font-style: italic;
  font-weight: 500;
  font-display: swap;
  src: url('${fontUrl}Inter-MediumItalic.woff2') format('woff2');
}

@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('${fontUrl}Inter-Bold.woff2') format('woff2');
}

@font-face {
  font-family: 'NotoSansKR';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('${fontUrl}NotoSansKR-Regular.woff2') format('woff2');
  unicode-range: U+1100-11FF, U+3130-318F, U+AC00-D7A3;
}

@font-face {
  font-family: 'NotoSansKR';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url('${fontUrl}NotoSansKR-Medium.woff2') format('woff2');
  unicode-range: U+1100-11FF, U+3130-318F, U+AC00-D7A3;
}

@font-face {
  font-family: 'NotoSansKR';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('${fontUrl}NotoSansKR-Bold.woff2') format('woff2');
  unicode-range: U+1100-11FF, U+3130-318F, U+AC00-D7A3;
}
`;
container.appendChild(style2);

const shadowRoot = container.attachShadow({ mode: "open" });
const styleElement = document.createElement("style");
styleElement.textContent = `
:host {
  all: initial;
}

* {
  font-family: 'NotoSansKR', 'Inter';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  text-decoration: none;
  color: inherit;
}
`;
shadowRoot.appendChild(styleElement);

const root = createRoot(shadowRoot);
root.render(<App />);
