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
import avatarDefault from "../assets/avatar-default.jpg";
import furnitureDefault from "../assets/furniture-default.png";
import { calculateSum, findNameById, formatDate, formatPrice } from "../utils";
import { StatusBadge } from "../components/ui/StatusBadge";
import { useContextName } from "../hooks/useContextName";

const ResourcePageContext = createContext();

export const ResourcePageProvider = ({ children }) => {
  const [context, setContext] = useState(null);

  const { data, deleteObject, isLoading } = useContext(DataContext);

  const { modals, openModal, closeModal } = useContext(ModalContext);

  const { form, detail, confirm } = modals;

  const headingByType = {
    products: {
      title: "Quản lý sản phẩm",
      button: { context: "Thêm sản phẩm", Icon: FaPlus },
    },
    orders: {
      title: "Quản lý đơn hàng",
    },
    customers: {
      title: "Quản lý khách hàng",
      button: { context: "Thêm khách hàng", Icon: FaPlus },
    },
  };

  const cardsByType = {
    products: [
      {
        title: "Tổng sản phẩm",
        content: data.products.length || "0",
        Icon: { icon: FaCube, color: "text-blue-600" },
      },
      {
        title: "Đang bán",
        content: data.products.filter((p) => p.status === "active").length || "0",
        Icon: { icon: FaCircle, color: "text-green-600", size: "w-2 h-2" },
      },
      {
        title: "Sắp hết hàng",
        content: "1",
        Icon: { icon: FaCircle, color: "text-yellow-400", size: "w-2 h-2" },
      },
      {
        title: "Hết hàng",
        content:
          data.products.filter((p) => p.status === "inactive").length || "0",
        Icon: { icon: FaCircle, color: "text-red-600", size: "w-2 h-2" },
      },
    ],
    orders: [
      {
        title: "Tổng đơn",
        content: data.orders.length || "0",
        Icon: { icon: FaCube },
      },
      {
        title: "Chờ xử lý",
        content:
          data.orders.filter((o) => o.status === "pending").length || "0",
        Icon: { icon: FaRegClock, color: "text-yellow-600 " },
      },
      {
        title: "Đang xử lý",
        content: "2",
        Icon: { icon: FaCube, color: "text-purple-600" },
      },
      {
        title: "Đang giao",
        content:
          data.orders.filter((o) => o.status === "shipping").length || "0",
        Icon: { icon: FaTruck, color: "text-orange-600" },
      },
      {
        title: "Hoàn thành",
        content:
          data.orders.filter((o) => o.status === "completed").length || "0",
        Icon: { icon: FaRegCircleCheck, color: "text-green-600" },
      },
      {
        title: "Đã huỷ",
        content:
          data.orders.filter((o) => o.status === "cancelled").length || "0",
        Icon: { icon: FaRegCircleXmark, color: "text-red-600" },
      },
    ],
    customers: [
      {
        title: "Tổng KH",
        content: data.customers.length || "0",
        Icon: { icon: FaUsers },
      },
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
      data: (data && data.products) || [],
      renderedRows: (item) => [
        <div className="flex">
          <img
            className="size-12 mr-2 rounded-lg"
            src={item.image_url || furnitureDefault}
            alt={"ảnh"}
            onError={e => { e.target.src = furnitureDefault; }}
          />
          <div>
            <p>{item.name || "N/A"}</p>
            <p>Tạo: {formatDate(item.created_at) || "N/A"}</p>
          </div>
        </div>,
        <>{item.category.name || "N/A"}</>,
        <>{formatPrice(item.price) || "N/A"}</>,
        <>{item.stock_quantity || "N/A"}</>,
        <>{<StatusBadge>{item.status}</StatusBadge> || "N/A"}</>,
      ],
    },

    orders: {
      headings: [
        "Mã đơn hàng",
        "Khách hàng",
        "Sản phẩm",
        "Tổng tiền",
        "Trạng thái",
      ],
      data: (data && data.orders) || [],
      renderedRows: (item) => [
        <div>
          <p>{item.order_number || "N/A"}</p>
          <p>{item.order_date || "N/A"}</p>
        </div>,
        <div>
          <p>{item.customer.full_name || "N/A"}</p>
          <p>{item.customer.phone || "N/A"}</p>
        </div>,
        <>
          <p>{item.order_details.length + " sản phẩm" || "N/A"}</p>
          <p className="text-xs">
            {findNameById(
              "products",
              item.order_details[0].product_id,
              data.products
            )}{" "}
            {item.order_details.length > 1 &&
              ` + ${item.order_details.length - 1} sản phẩm khác`}
          </p>
        </>,
        <>{formatPrice(item.total_amount) || "N/A"}</>,
        <>{<StatusBadge>{item.status}</StatusBadge> || "N/A"}</>,
      ],
    },

    customers: {
      headings: [
        "Tên khách hàng",
        "Liên hệ",
        "Tổng đơn hàng",
        "Tổng chi tiêu",
        "Đơn gần nhất",
      ],
      data: (data && data.customers) || [],
      renderedRows: (item) => [
        <div className="flex">
          <img
            className="size-12 mr-2 rounded-3xl"
            src={item.avatar || avatarDefault}
            alt="avatar"
            onError={e => { e.target.src = avatarDefault; }}
          />
          <div>
            <p>{item.full_name || "N/A"}</p>
            <p>Tham gia: {formatDate(item.created_at) || "N/A"}</p>
          </div>
        </div>,
        <div>
          <p>{item.email || "N/A"}</p>
          <p>{item.phone || "N/A"}</p>
        </div>,
        <>{item.orders.length}</>,
        <>
          {formatPrice(
            calculateSum(item.orders.map((order) => order.total_amount))
          ) || "N/A"}
        </>,
        <>
          {(item.orders.length && formatDate(item.orders.at(-1).order_date)) ||
            "N/A"}
        </>,
      ],
    },
  };

  const formConfig = {
    products: {
      objectType: "products",
      keys:
        data && data.products && data.products.length > 0
          ? Object.keys(data.products[0]).filter(
              (key) => key !== "status" && key !== "created_at"
            )
          : [],
      labels: ["Tên sản phẩm", "Hình ảnh", "Danh mục", "Giá", "Số lượng hàng"],
      onSubmit: () => {
        alert("Submitted");
      },
    },

    orders: {
      objectType: "orders",
      keys:
        data && data.orders && data.orders.length > 0
          ? Object.keys(data.orders[0]).filter((key) => key !== "status")
          : [],
      labels: ["Mã đơn hàng", "Ngày giao hàng", "Khách hàng", "Tổng tiền"],
      onSubmit: () => {
        alert("Submitted");
      },
    },

    customers: {
      objectType: "customers",
      keys:
        data && data.customers && data.customers.length > 0
          ? Object.keys(data.customers[0]).filter(
              (key) => key !== "status" && key !== "created_at"
            )
          : [],
      labels: [
        "Tên khách hàng",
        "Email",
        "SĐT",
        "Tổng chi tiêu",
        "Đơn gần nhất",
      ],
      onSubmit: () => {
        alert("Submitted");
      },
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
      openModal(
        "detail",
        {
          data: object,
          labels: [
            "Tên",
            "Danh mục",
            "Giá",
            "Số lượng hàng tồn kho",
            "Trạng thái",
          ],
        },
        "product"
      );
    },

    orders: ({ object }) => {
      openModal(
        "detail",
        {
          data: object,
          labels: [
            "Mã đơn hàng",
            "Khách hàng",
            "Sản phẩm",
            "Tổng tiền",
            "Trạng thái",
          ],
        },
        "order"
      );
    },

    customers: ({ object }) => {
      openModal(
        "detail",
        {
          data: object,
          labels: [
            "Tên khách hàng",
            "Liên hệ",
            "Tổng đơn hàng",
            "Tổng chi tiêu",
            "Đơn gần nhất",
          ],
        },
        "customer"
      );
    },
  };

  const contextByType = {
    products: {
      heading: headingByType.products,
      cards: cardsByType.products,
      table: tableByType.products,
      searchInputPlaceholder: "Tìm kiếm sản phẩm, SKU",
      formConfig: formConfig.products,
      onDelete: onDeleteByType.products,
      onView: onViewByType.products,
    },

    orders: {
      heading: headingByType.orders,
      cards: cardsByType.orders,
      table: tableByType.orders,
      searchInputPlaceholder: "Tìm mã đơn, tên khách hàng, SĐT...",
      formConfig: formConfig.orders,
      onView: onViewByType.orders,
    },

    customers: {
      heading: headingByType.customers,
      cards: cardsByType.customers,
      table: tableByType.customers,
      searchInputPlaceholder: "Tìm mã đơn, tên khách hàng, SĐT...",
      formConfig: formConfig.customers,
      onView: onViewByType.customers,
    },
  };

  const path = useContextName();
  console.log("ResourcePageContext path:", path);

  useEffect(() => {
    data && setContext(contextByType[path]);
  }, [data, path]);

  if (!data || isLoading) {
    return null;
  }

  return (
    <ResourcePageContext.Provider value={{ context }}>
      {children}
    </ResourcePageContext.Provider>
  );
};

export default ResourcePageContext;
