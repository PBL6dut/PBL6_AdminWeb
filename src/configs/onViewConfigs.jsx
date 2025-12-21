import { useContext } from "react";
import ModalContext from "../contexts/ModalContext";
import ProductModal from "../components/ui/modal/detail/Product";
import OrderModal from "../components/ui/modal/detail/Order";
import CustomerModal from "../components/ui/modal/detail/Customer";

export const OpenProductDetailModal = (item, openModal) => {
  return openModal(<ProductModal item={item} />, "Chi tiết sản phẩm", "xl");
};

export const OpenOrderDetailModal = (item, openModal) => {
  return openModal(<OrderModal item={item} />, "Chi tiết đơn hàng", "xl");
};

export const OpenCustomerDetailModal = (item, openModal) => {
  return openModal(<CustomerModal item={item} />, "Chi tiết khách hàng", "xl");
};

// export default onViewConfigs;
