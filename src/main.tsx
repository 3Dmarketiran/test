import "@google/model-viewer";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.css";
import "./styles/redesign.css";

// Preserve compatibility with legacy links that used HashRouter URLs such as /#/products/slug.
if (typeof window !== "undefined" && window.location.hash.startsWith("#/")) {
  const legacyPath = window.location.hash.slice(1);
  window.history.replaceState(null, "", `${window.location.origin}${legacyPath}`);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
