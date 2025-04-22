import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

const container = document.createElement("div");
document.body.appendChild(container);

const fontUrl = chrome.runtime.getURL("static/fonts/");

const shadowRoot = container.attachShadow({ mode: "open" });
const styleElement = document.createElement("style");
styleElement.textContent = `
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  src: url('${fontUrl}Inter-Regular.woff2') format('woff2');
}

@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  src: url('${fontUrl}Inter-Medium.woff2') format('woff2');
}

@font-face {
  font-family: 'Inter';
  font-style: italic;
  font-weight: 500;
  src: url('${fontUrl}Inter-MediumItalic.woff2') format('woff2');
}

@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  src: url('${fontUrl}Inter-Bold.woff2') format('woff2');
}

:host {
  all: initial;
}

* {
  font-family: 'Inter', system-ui;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  text-decoration: none;
}
`;
shadowRoot.appendChild(styleElement);

const root = createRoot(shadowRoot);
root.render(<App />);
