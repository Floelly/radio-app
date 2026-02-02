import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ToastFeedbackProvider } from "@context/ToastFeedbackContext.jsx";
import { AppContextProvider } from "@context/AppContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastFeedbackProvider>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </ToastFeedbackProvider>
  </StrictMode>,
);
