import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./index.css";
import { initGA4 } from "./lib/ga4-init";

// Initialise GA4 before React renders; no-op when VITE_GA4_ID is not set.
initGA4();

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
