import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";
import { Analytics } from "@vercel/analytics/react";
import { I18nProvider } from "./lib/i18n";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <I18nProvider>
      <App />
    </I18nProvider>
    <Analytics />
  </BrowserRouter>
);
