import { useContext } from "react";
import ModalContext from "../../../contexts/ModalContext";
import ResourcePageContext from "../../../contexts/ResourcePageContext";
import { DetailModal } from "./detail/DetailModal";
import { NotificationModal } from "./NotificationModal";
import { ConfirmModal } from "./ConfirmModal";
// import { ProductForm } from '../Form';
import { FormModal } from "./form/FormModal";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const Modals = () => {
  const { modals, closeModal } = useContext(ModalContext);
  const { form, confirm, detail, notification } = modals || {};
  return (
    <>
      {confirm.isOpen && confirm.context && (
        <ConfirmModal
          isOpen={confirm.isOpen}
          onClose={() => closeModal("confirm")}
          type={confirm.context.type || "default"}
          message={confirm.context.message || ""}
          onConfirm={confirm.context.onConfirm || (() => {})}
        />
      )}
      {detail.isOpen && detail.context && detail.objectType && (
        <DetailModal
          isOpen={detail.isOpen}
          onClose={() => closeModal("detail")}
          data={detail.context.data}
          objectType={detail.objectType}
          size={detail.context.size || "xl"}
        />
      )}
      {notification.isOpen && notification.context && (
        <NotificationModal
          isOpen={notification.isOpen}
          onClose={() => closeModal("notification")}
          message={notification.context.message || ""}
          type={notification.context.type || "default"}
        />
      )}
      {form.isOpen && form.context && (
        <FormModal
          isOpen={form.isOpen}
          onClose={() => closeModal("form")}
          title={form.context.title || "Chỉnh sửa thông tin"}
          size={form.context.size || "lg"}
          onSubmit={form.context.onSubmit || (() => {})}
          initialData={form.context.initialData || {}}
        />
      )}
    </>
  );
};
