import { createContext, useContext, useEffect, useState } from "react";
import {
  FaCircle,
  FaCoins,
  FaCube,
  FaPlus,
  FaRegCircleCheck,
  FaRegCircleXmark,
  FaRegClock,
  FaRegStar,
  FaTruck,
  FaUserPlus,
  FaUsers,
} from "react-icons/fa6";
import DataContext from "./DataContext";
import ModalContext from "./ModalContext";
import { useLocation } from "react-router-dom";

const ResourcePageContext = createContext();

export const ResourcePageProvider = ({ children }) => {
  const [context, setContext] = useState(null);

  const { data, deleteObject } = useContext(DataContext);

  const { 
    modals, 
    openModal, 
    closeModal, 
    closeAllModals 
  } = useContext(ModalContext);
  
  const { form, detail, confirm } = modals;

  const headingByType = {
    products: {
      title: "Quản lý sản phẩm",
      button: { context: "Thêm sản phẩm", Icon: FaPlus },
    },
    orders: {
      title: "Quản lý đơn hàng",
    },
    users: {
      title: "Quản lý người dùng",
      button: { context: "Thêm người dùng", Icon: FaPlus },
    },
  };

  const cardsByType = {
    products: [
      {
        title: "Tổng sản phẩm",
        content: "6",
        Icon: { icon: FaCube, color: "text-blue-600" },
      },
      {
        title: "Đang bán",
        content: "4",
        Icon: { icon: FaCircle, color: "text-green-600", size: "w-2 h-2" },
      },
      {
        title: "Sắp hết hàng",
        content: "1",
        Icon: { icon: FaCircle, color: "text-yellow-400", size: "w-2 h-2" },
      },
      {
        title: "Hết hàng",
        content: "2",
        Icon: { icon: FaCircle, color: "text-red-600", size: "w-2 h-2" },
      },
    ],
    orders: [
      { title: "Tổng đơn", content: "6", Icon: { icon: FaCube } },
      {
        title: "Chờ xử lý",
        content: "1",
        Icon: { icon: FaRegClock, color: "text-yellow-600 " },
      },
      {
        title: "Đang xử lý",
        content: "2",
        Icon: { icon: FaCube, color: "text-purple-600" },
      },
      {
        title: "Đang giao",
        content: "1",
        Icon: { icon: FaTruck, color: "text-orange-600" },
      },
      {
        title: "Hoàn thành",
        content: "1",
        Icon: { icon: FaRegCircleCheck, color: "text-green-600" },
      },
      {
        title: "Đã huỷ",
        content: "1",
        Icon: { icon: FaRegCircleXmark, color: "text-red-600" },
      },
    ],
    users: [
      { title: "Tổng KH", content: "6", Icon: { icon: FaUsers } },
      {
        title: "KH mới",
        content: "1",
        Icon: { icon: FaUserPlus, color: "text-blue-600 " },
      },
      {
        title: "KH thường",
        content: "2",
        Icon: { icon: FaUsers, color: "text-green-600" },
      },
      {
        title: "Khách hàng VIP",
        content: "1",
        Icon: { icon: FaRegStar, color: "text-purple-600" },
      },
      {
        title: "Tổng doanh thu",
        content: "1",
        Icon: { icon: FaCoins, color: "text-orange-600" },
      },
      {
        title: "Giá trị TB/KH",
        content: "1",
        Icon: { icon: FaUsers, color: "text-teal-600" },
      },
    ],
  };

  const tableByType = {
    products: {
      headings: ["Sản phẩm", "Danh mục", "Giá", "Tồn kho", "Trạng thái"],
      data: data && data.products || [],
      renderedRow: [
        
      ]
    },

    orders: {
      headings: [
        "Mã đơn hàng",
        "Khách hàng",
        "Sản phẩm",
        "Tổng tiền",
        "Trạng thái",
      ],
      data: data && data.orders || [],
    },

    users: {
      headings: [
        "Tên khách hàng",
        "Liên hệ",
        "Tổng đơn hàng",
        "Tổng chi tiêu",
        "Đơn gần nhất",
      ],
      data: data && data.users || [],
    },
  };

  const onDeleteByType = {
    products: ({ object }) => {
      openModal("confirm", {
        type: "danger",
        message: "Bạn có chắc chắn muốn xóa sản phẩm này?",
        onConfirm: () => {
          deleteObject("products", object);
          alert("Đã xoá sản phẩm thành công");
          closeModal("confirm");
        },
      });
    },
  };

  const onViewByType = {
    products: ({ object }) => {
      openModal("detail", {
        data: object,
        labels: [
          "Tên",
          "Danh mục",
          "Giá",
          "Số lượng hàng tồn kho",
          "Trạng thái",
        ],
      });
    },

    orders: ({ object }) => {
      openModal("detail", {
        data: object,
        labels: [
          "Mã đơn hàng",
          "Khách hàng",
          "Sản phẩm",
          "Tổng tiền",
          "Trạng thái",
        ],
      });
    },

    users: ({ object }) => {
      openModal("detail", {
        data: object,
        labels: [
          "Tên khách hàng",
          "Liên hệ",
          "Tổng đơn hàng",
          "Tổng chi tiêu",
          "Đơn gần nhất",
        ],
      });
    }
  };

  const contextByType = {
    products: {
      heading: headingByType.products,
      cards: cardsByType.products,
      table: tableByType.products,
      searchInputPlaceholder: "Tìm kiếm sản phẩm, SKU",
      onDelete: onDeleteByType.products,
      onView: onViewByType.products,
    },

    orders: {
      heading: headingByType.orders,
      cards: cardsByType.orders,
      table: tableByType.orders,
      searchInputPlaceholder: "Tìm mã đơn, tên khách hàng, SĐT...",
      onView: onViewByType.orders,
    },

    users: {
      heading: headingByType.users,
      cards: cardsByType.users,
      table: tableByType.users,
      searchInputPlaceholder: "Tìm mã đơn, tên khách hàng, SĐT...",
      onView: onViewByType.users,
    },
  };

  const path = useLocation().pathname.replace("/dashboard/", "");
  console.log("ResourcePageContext path:", path);

  useEffect(() => {
    data && setContext(contextByType[path]);
  }, [data, path]);

  if(!data){
    return <div>Loading...</div>
  }

  return (
    <ResourcePageContext.Provider value={{context}}>
      {children}
    </ResourcePageContext.Provider>
  );
};

export default ResourcePageContext;
