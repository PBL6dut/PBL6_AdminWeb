import { useContext } from "react";
import DataContext from "../contexts/DataContext";
import { deleteProduct } from "../services/productService";

const onDeleteConfigs = (openModal, deleteObject, closeModal) => {
  const products = ({ object }) => {
    openModal("confirm", {
      type: "danger",
      message: "Bạn có chắc chắn muốn xóa sản phẩm này?",
      onConfirm: async () => {
        const response = await deleteProduct(object.id);
        if (response.success) {
          deleteObject("products", object);
          closeModal("confirm");
          openModal('notification', {message: 'Xoá sản phẩm thành công!', type: 'success'});
        }
      },
    });
  };

    return { products }
};

export default onDeleteConfigs;
