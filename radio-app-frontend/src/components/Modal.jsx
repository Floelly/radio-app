import { useEffect } from "react";

const Modal = ({ isOpen, onClose, title = null, className = "", children }) => {
  // ESC-Taste schließt Modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", handleEsc);
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-25 flex items-center justify-center bg-black/40 p-4"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className={`w-full max-w-md min-h-[20rem] rounded-2xl bg-base-100 shadow-xl px-6 pt-6 pb-10 flex flex-col ${className}`}
      >
        {/* Optional Title */}
        {title && (
          <h3 className="text-xl font-bold text-center mb-6">{title}</h3>
        )}

        {/* Inhalt */}
        <div className="flex-1 flex flex-col">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
