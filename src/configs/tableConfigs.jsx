import {
  calculateSum,
  findNameById,
  formatDate,
  formatImageUrl,
  formatPrice,
} from "../utils";
import furnitureDefault from "../assets/furniture-default.png";
import avatarDefault from "../assets/avatar-default.jpg";
import { StatusBadge } from "../components/ui/StatusBadge";
import {
  OpenCustomerDetailModal,
  OpenOrderDetailModal,
  OpenProductDetailModal,
} from "./onViewConfigs";
import { IconButton } from "../components/ui/Button";
import { useContext } from "react";
import ModalContext from "../contexts/ModalContext";
import { OpenProductFormModal } from "./onEditConfigs";
import {
  useDeleteProductMutation,
  useUpdateProductMutation,
} from "../services/product.api";
import { OpenConfirmDeleteProductModal } from "./onDeleteConfigs";

export const GetProductColumns = (categories = []) => {
  const { openModal, closeModal } = useContext(ModalContext);
  // console.log(categories)
  const [updateProduct, updateResult] = useUpdateProductMutation();
  const [deleteProduct, deleteResult] = useDeleteProductMutation();
  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <StatusBadge variant="bold_green">Đang bán</StatusBadge>;
      case "inactive":
        return <StatusBadge variant="red">Hết hàng</StatusBadge>;
    }
  };
  return [
    {
      header: "Sản phẩm",
      key: "name",
      render: (item) => (
        <div className="flex gap-2 items-center max-w-96">
          <img
            className="size-14 rounded-lg"
            src={item?.images?.[0]?.url || furnitureDefault}
            alt={"ảnh"}
            onError={(e) => {
              e.target.src = furnitureDefault;
            }}
          />
          <div>
            <p className="font-bold">{item.name || "N/A"}</p>
            <p className="text-sm">
              Tạo: {formatDate(item.created_at) || "N/A"}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Danh mục",
      key: "category",
      render: (item) => <>{item.category.name || "N/A"}</>,
    },
    {
      header: "Giá",
      key: "price",
      render: (item) => <>{formatPrice(item.price) || "N/A"}</>,
    },
    {
      header: "Tồn kho",
      key: "stock_quantity",
    },
    {
      header: "Trạng thái",
      key: "status",
      render: (item) => <>{getStatusBadge(item.status) || "N/A"}</>,
    },
    {
      header: "",
      key: "actions",
      render: (item) => (
        <>
          <IconButton
            iconType="view"
            handleClick={() => OpenProductDetailModal(item, openModal)}
          />
          <IconButton
            iconType="edit"
            handleClick={() =>
              OpenProductFormModal(
                openModal,
                closeModal,
                item,
                async (formData) => {
                  // 1. Tạo đối tượng FormData
                  const payload = new FormData();

                  // 2. Duyệt qua từng key của dữ liệu form để append vào FormData
                  Object.keys(formData).forEach((key) => {
                    if (key === "image_url") {
                      // Xử lý riêng cho trường images (vì là FileList hoặc mảng)
                      if (formData[key] && formData[key].length > 0) {
                        // Nếu là FileList (từ input type file)
                        Array.from(formData[key]).forEach((file) => {
                          // Chỉ append nếu đó thực sự là File mới (không phải URL ảnh cũ)
                          if (file instanceof File) {
                            payload.append("image_url", file);
                          }
                        });
                      }
                    } else {
                      // Các trường text/number bình thường
                      payload.append(key, formData[key]);
                    }
                  });

                  // 3. Gọi API với payload là FormData
                  await updateProduct({ id: item.id, productData: payload })
                    .unwrap()
                    .then(() => closeModal());
                },
                categories
              )
            }
          />

          <IconButton
            iconType="delete"
            handleClick={() =>
              OpenConfirmDeleteProductModal(openModal, closeModal, async () => {
                await deleteProduct(item.id)
                  .unwrap()
                  .then(() => closeModal());
              })
            }
          />
        </>
      ),
    },
  ];
};

export const GetCustomerColumns = () => {
  const { openModal } = useContext(ModalContext);
  return [
    {
      header: "Khách hàng",
      key: "fullname",
      render: (item) => (
        <div className="flex">
          <img
            className="size-12 mr-2 rounded-3xl"
            src={item.avatar || avatarDefault}
            alt="avatar"
            onError={(e) => {
              e.target.src = avatarDefault;
            }}
          />
          <div>
            <p className="font-bold">{item.full_name || "N/A"}</p>
            <p className="text-sm">
              Tham gia: {formatDate(item.created_at) || "N/A"}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Liên hệ",
      key: "email",
      render: (item) => (
        <div>
          <p>{item.email || "N/A"}</p>
          <p>{item.phone || "N/A"}</p>
        </div>
      ),
    },
    {
      header: "Tổng đơn hàng",
      key: "orders",
      render: (item) => <>{item.orders.length || "0"}</>,
    },
    {
      header: "Tổng chi tiêu",
      key: "total_spent",
      render: (item) => (
        <>
          {formatPrice(
            calculateSum(item.orders.map((order) => order.total_amount))
          ) || "0"}
        </>
      ),
    },
    {
      header: "Đơn gần nhất",
      key: "latest_order",
      render: (item) => (
        <>
          {(item.orders.length && formatDate(item.orders.at(-1).order_date)) ||
            "N/A"}
        </>
      ),
    },
    {
      header: "",
      key: "actions",
      render: (item) => (
        <>
          <IconButton
            iconType="view"
            handleClick={() => OpenCustomerDetailModal(item, openModal)}
          />
          {/* <IconButton
            iconType="edit"
            handleClick={() => onViewConfigs({ object: item })}
          />

          <IconButton
            iconType="delete"
            handleClick={() => onViewConfigs({ object: item })}
          /> */}
        </>
      ),
    },
  ];
};

export const GetOrderColumns = () => {
  const { openModal } = useContext(ModalContext);
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <StatusBadge variant="yellow">Chờ xử lý</StatusBadge>;
      case "shipping":
        return <StatusBadge variant="green">Đang giao</StatusBadge>;
      case "completed":
        return <StatusBadge variant="bold_green">Hoàn thành</StatusBadge>;
      case "cancelled":
        return <StatusBadge variant="red">Đã huỷ</StatusBadge>;
      case "confirmed":
        return <StatusBadge variant="green">Đã xác nhận</StatusBadge>;
      default:
        return <StatusBadge>{status}</StatusBadge>;
    }
  };
  return [
    {
      header: "Mã đơn hàng",
      key: "order_number",
      render: (item) => (
        <div>
          <p className="font-bold">{item.order_number || "N/A"}</p>
          <p className="text-sm">{formatDate(item.order_date) || "N/A"}</p>
        </div>
      ),
    },
    {
      header: "Khách hàng",
      key: "customer",
      render: (item) => (
        <div>
          <p>{item.customer.full_name || "N/A"}</p>
          <p>{item.customer.phone || "N/A"}</p>
        </div>
      ),
    },
    {
      header: "Sản phẩm",
      key: "order_details",
      render: (item) => (
        <div className="max-w-sm">
          <p>{item.order_details.length + " sản phẩm" || "N/A"}</p>
          <p className="text-xs">
            {item.order_details[0].product.name}{" "}
            {item.order_details.length > 1 &&
              ` + ${item.order_details.length - 1} sản phẩm khác`}
          </p>
        </div>
      ),
    },
    {
      header: "Tổng tiền",
      key: "total_amount",
      render: (item) => <>{formatPrice(Number(item.total_amount)) || "N/A"}</>,
    },
    {
      header: "Trạng thái",
      key: "status",
      render: (item) => <>{getStatusBadge(item.status) || "N/A"}</>,
    },
    {
      header: "",
      key: "actions",
      render: (item) => (
        <>
          <IconButton
            iconType="view"
            handleClick={() => OpenOrderDetailModal(item, openModal)}
          />
          {/* <IconButton
            iconType="edit"
            // handleClick={() => onViewConfigs({ object: item })}
          />

          <IconButton
            iconType="delete"
            // handleClick={() => onViewConfigs({ object: item })}
          /> */}
        </>
      ),
    },
  ];
};
