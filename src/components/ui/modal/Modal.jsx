import { useContext } from "react";
import ModalContext from "../../../contexts/ModalContext";

const Modal = () => {
  const { modal, closeModal } = useContext(ModalContext);
  if (!modal.isOpen) return null;

  const { childComponent, title, size } = modal;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 backdrop-blur-sm bg-opacity-50 transition-opacity"
        onClick={closeModal}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`relative bg-white rounded-xl shadow-xl w-full ${sizeClasses[size]} transform transition-all`}
        >
          <div className="relative mb-10">
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 cursor-pointer text-black hover:text-gray-600 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          {/* Header */}
          {title && (
            <div className="p-4 flex justify-center border-t-2 border-gray-300">
              <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
            </div>
          )}

          {/* Content */}
          <div className="px-6 pb-6">{childComponent}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
