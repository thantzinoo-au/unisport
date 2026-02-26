import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ColorModeProvider } from "./context/ColorModeContext.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import App from "./App.jsx";
import Toaster from "./components/Toaster.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ColorModeProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <App />
          <Toaster />
        </BrowserRouter>
      </ErrorBoundary>
    </ColorModeProvider>
  </StrictMode>,
);
