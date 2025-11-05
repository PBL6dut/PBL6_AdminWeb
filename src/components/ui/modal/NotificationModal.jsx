import { FaCircleExclamation, FaRegCircleCheck } from "react-icons/fa6";
import Modal from './BaseModal'

export const NotificationModal = ({isOpen, onClose, message, title="Thông báo", type="default"}) => {
  const getTypeStyles = () => {
    switch (type) {
      // case "danger":
      //   return {
      //     icon: <FaRegCircleXmark className="w-6 h-6 text-red-600" />,
      //     iconBg: "bg-red-100",
      //     confirmBtn: (
      //       <Button
      //         variant="red"
      //         children={confirmText}
      //         handleClick={handleConfirm}
      //       />
      //     ),
      //   };
      case 'success':
        return {
          icon: <FaRegCircleCheck className="w-6 h-6 text-green-600" />,
          iconBg: "bg-green-100",
        };
      default:
        return {
          icon: <FaCircleExclamation className="w-6 h-6 text-blue-600" />,
          iconBg: "bg-blue-100",
        };
    }
  };

  const styles = getTypeStyles();

  return(
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
      </div>
    </Modal>
  )
}