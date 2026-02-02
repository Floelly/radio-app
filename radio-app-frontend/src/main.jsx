import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ToastFeedbackProvider } from "./context/ToastContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastFeedbackProvider>
      <App />
    </ToastFeedbackProvider>
  </StrictMode>,
);
