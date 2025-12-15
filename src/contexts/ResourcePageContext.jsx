import { createContext, useContext, useEffect, useState } from "react";
import DataContext from "./DataContext";
import ModalContext from "./ModalContext";
import { useContextName } from "../hooks/useContextName";
import { deleteProduct } from "../services/productService";
import { useToast } from "../components/ui/Toast";
import headingByType from "../configs/headingConfigs";
import cardsByType from "../configs/cardConfigs";
import tableByType from "../configs/tableConfigs";
import formConfigByType from "../configs/formConfigs";
import onDeleteByType from "../configs/onDeleteConfigs";
import onViewByType from "../configs/onViewConfigs";
import onEditByType from "../configs/onEditConfigs";

const ResourcePageContext = createContext();

export const ResourcePageProvider = ({ children }) => {
  const [context, setContext] = useState(null);

  const { data, deleteObject, isLoading } = useContext(DataContext);

  const { modals, openModal, closeModal } = useContext(ModalContext);

  const toast = useToast();

  const { form, detail, confirm } = modals;

  const contextByType = {
    products: {
      heading: headingByType(openModal, closeModal, toast).products,
      cards: cardsByType(data).products,
      table: tableByType(data).products,
      searchInputPlaceholder: "Tìm kiếm sản phẩm, SKU",
      formConfig: formConfigByType(data).products,
      onDelete: onDeleteByType(openModal, deleteObject, closeModal).products,
      onView: onViewByType(openModal).products,
      onEdit: onEditByType(openModal, closeModal).products,
    },

    orders: {
      heading: headingByType().orders,
      cards: cardsByType(data).orders,
      table: tableByType(data).orders,
      searchInputPlaceholder: "Tìm mã đơn, tên khách hàng, SĐT...",
      formConfig: formConfigByType(data).orders,
      onView: onViewByType(openModal).orders,
    },

    customers: {
      heading: headingByType().customers,
      cards: cardsByType(data).customers,
      table: tableByType(data).customers,
      searchInputPlaceholder: "Tìm mã đơn, tên khách hàng, SĐT...",
      formConfig: formConfigByType(data).customers,
      onView: onViewByType(openModal).customers,
    },
  };

  const path = useContextName();
  console.log("ResourcePageContext path:", path);

  useEffect(() => {
    data && setContext(contextByType[path]);
  }, [data, path]);

  // Không block render khi loading, chỉ cần context là null
  // Component sử dụng context sẽ tự xử lý khi context chưa có
  return (
    <ResourcePageContext.Provider value={{ context, isLoading }}>
      {children}
    </ResourcePageContext.Provider>
  );
};

export default ResourcePageContext;
