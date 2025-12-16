import { ConfirmModal } from "../components/ui/modal/ConfirmModal";

const OpenConfirmDeleteProductModal = (openModal, closeModal, onConfirm) => {
  openModal(
    <ConfirmModal onClose={closeModal} onConfirm={onConfirm} type="danger" title="Xác nhận xoá sản phẩm?" message="Hành động này không thể hoàn tác." />,
    "",
    "sm"
  );
};

export { OpenConfirmDeleteProductModal };
