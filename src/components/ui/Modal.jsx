import { useContext } from "react";
import { Button } from "./Button";
import {
  FaRegCircleXmark,
  FaRegCircleQuestion,
  FaCircleExclamation,
} from "react-icons/fa6";
import ModalContext from "../../contexts/ModalContext";

const Modal = ({ isOpen, onClose, children, title, size = "md" }) => {
  // if (!isOpen) return null;

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
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`relative bg-white rounded-xl shadow-xl w-full ${sizeClasses[size]} transform transition-all`}
        >
          <div className="relative mb-10">
            <button
              onClick={onClose}
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
          <div className="px-6 pb-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

const ConfirmModal = ({
  isOpen,
  onClose,
  title = "Xác nhận",
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  onConfirm,
  type = "default", // default, danger, warning
}) => {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          icon: <FaRegCircleXmark className="w-6 h-6 text-red-600" />,
          iconBg: "bg-red-100",
          confirmBtn: (
            <Button
              variant="red"
              children={confirmText}
              handleClick={handleConfirm}
            />
          ),
        };
      case "warning":
        return {
          icon: <FaCircleExclamation className="w-6 h-6 text-yellow-600" />,
          iconBg: "bg-yellow-100",
          confirmBtn: (
            <Button
              variant="yellow"
              children={confirmText}
              handleClick={handleConfirm}
            />
          ),
        };
      default:
        return {
          icon: <FaRegCircleQuestion className="w-6 h-6 text-blue-600" />,
          iconBg: "bg-blue-100",
          confirmBtn: (
            <Button
              variant="default"
              children={confirmText}
              handleClick={handleConfirm}
            />
          ),
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        {/* Icon */}
        <div
          className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${styles.iconBg} mb-4`}
        >
          {styles.icon}
        </div>

        {/* Title */}
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>

        {/* Message */}
        {message && <p className="text-sm text-gray-500 mb-6">{message}</p>}

        {/* Actions */}
        <div className="flex justify-center space-x-3">
          <Button
            variant="alternative"
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            {cancelText}
          </Button>
          {styles.confirmBtn}
        </div>
      </div>
    </Modal>
  );
};

export const DetailModal = ({
  isOpen,
  onClose,
  labels,
  data,
  title = "Chi tiết",
}) => {
  if (!data) return null;

  const values = Object.values(data);

  const Row = ({ label, value }) => {
    return (
      <div className="flex items-center justify-between py-3 px-4 mb-2">
        <span className="flex items-center gap-2 text-lg font-semibold">
          {label}
        </span>
        <span className="text-sm font-medium text-gray-800">{value}</span>
      </div>
    );
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 shadow-sm">
        {labels.map((label, index) => (
          <Row key={index} label={label} value={values[index]} />
        ))}
      </div>
    </Modal>
  );
};

export const Modals = () => {
  const { modals, closeModal } = useContext(ModalContext);
  const { form, confirm, detail } = modals || {};
  return (
    <>
      {confirm.isOpen && confirm.context && (
        <ConfirmModal
          isOpen={confirm.isOpen}
          onClose={() => closeModal("confirm")}
          message={confirm.context.message || ""}
          onConfirm={confirm.context.onConfirm || (() => {})}
        />
      )}
      {detail.isOpen && detail.context && (
        <DetailModal
          isOpen={detail.isOpen}
          onClose={() => closeModal("detail")}
          data={detail.context.data}
          labels={detail.context.labels}
        />
      )}
    </>
  );
};
