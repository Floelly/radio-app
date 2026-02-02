import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const ToastContext = createContext();

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

  return (
    <ToastContext.Provider value={{ showToast }}>
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

// eslint-disable-next-line react-refresh/only-export-components
export const useErrorFeedback = () => {
  const context = useContext(ToastContext);
  if (!context) {
    console.error(
      "useSuccessFeedback must be used inside a ToastFeedbackProvider!",
    );
    return () => {};
  }
  return (text) => context.showToast("error", text);
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSuccessFeedback = () => {
  const context = useContext(ToastContext);
  if (!context) {
    console.error(
      "useSuccessFeedback must be used inside a ToastFeedbackProvider!",
    );
    return () => {};
  }
  return (text) => context.showToast("success", text);
};
