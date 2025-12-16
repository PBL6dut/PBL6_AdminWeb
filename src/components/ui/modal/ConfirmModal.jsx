import { FaCircleExclamation, FaRegCircleQuestion, FaRegCircleXmark } from 'react-icons/fa6';
import Modal from './BaseModal'
import { Button } from '../Button'

export const ConfirmModal = ({
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
  );
};
