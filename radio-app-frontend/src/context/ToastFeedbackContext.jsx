import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";

const ToastContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useFeedbackContext = () => {
  const context = useContext(ToastContext);
  if (!context)
    throw new Error("useFeedbackContext must be inside ToastFeedbackProvider");
  return context;
};

export const ToastFeedbackProvider = ({ children }) => {
  const [toast, setToastInternal] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToastInternal(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = useCallback((type, text) => {
    setToastInternal({ type, text });
  }, []);

  const showError = useCallback(
    (text) => showToast("error", text),
    [showToast],
  );

  const showSuccess = useCallback(
    (text) => showToast("success", text),
    [showToast],
  );

  return (
    <ToastContext.Provider value={{ showToast, showError, showSuccess }}>
      {children}
      {toast && (
        <div className="absolute top-1/2 left-1/2 w-full max-w-sm -translate-x-1/2 px-4 pointer-events-none z-30">
          <div
            className={
              "text-white text-sm rounded-lg px-3 py-2 shadow text-center whitespace-pre-line " +
              (toast.type === "error" ? "bg-red-500/90" : "bg-green-500/90")
            }
          >
            {toast.text}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};
