import { createContext, useContext, useState, useCallback } from "react";
import { FaCheckCircle, FaExclamationCircle, FaTimesCircle } from "react-icons/fa";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info", duration = 5000) => {
    const id = Date.now();
    const newToast = { id, message, type, duration };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((message) => showToast(message, "success"), [showToast]);
  const error = useCallback((message) => showToast(message, "error", 7000), [showToast]);
  const warning = useCallback((message) => showToast(message, "warning"), [showToast]);
  const info = useCallback((message) => showToast(message, "info"), [showToast]);

  return (
    <ToastContext.Provider value={{ success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

const Toast = ({ toast, onRemove }) => {
  const { id, message, type } = toast;

  const config = {
    success: {
      icon: FaCheckCircle,
      bgColor: "bg-green-500",
      textColor: "text-white",
    },
    error: {
      icon: FaExclamationCircle,
      bgColor: "bg-red-500",
      textColor: "text-white",
    },
    warning: {
      icon: FaExclamationCircle,
      bgColor: "bg-yellow-500",
      textColor: "text-white",
    },
    info: {
      icon: FaCheckCircle,
      bgColor: "bg-blue-500",
      textColor: "text-white",
    },
  };

  const { icon: Icon, bgColor, textColor } = config[type] || config.info;

  return (
    <div
      className={`${bgColor} ${textColor} p-4 rounded-lg shadow-lg flex items-start gap-3 animate-slide-in-right min-w-80`}
    >
      <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-medium whitespace-pre-line">{message}</p>
      </div>
      <button
        onClick={() => onRemove(id)}
        className="text-white hover:text-gray-200 transition-colors"
      >
        <FaTimesCircle className="w-5 h-5" />
      </button>
    </div>
  );
};
