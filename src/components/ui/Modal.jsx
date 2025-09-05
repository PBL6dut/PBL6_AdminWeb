import { use, useContext } from "react";
import { Button } from "./Button";
import {
  FaRegCircleXmark,
  FaRegCircleQuestion,
  FaCircleExclamation,
  FaEnvelope,
  FaPhone,
  FaLocationDot,
  FaCalendar,
  FaAddressCard,
  FaNoteSticky,
  FaScissors,
  FaBoxesStacked,
  FaClock,
  FaPalette,
  FaRuler,
  FaCoins,
} from "react-icons/fa6";
import ModalContext from "../../contexts/ModalContext";
import ResourcePageContext from "../../contexts/ResourcePageContext";
import { createValidationRules } from "../../hooks/useFormValidation";
import { useForm } from "../../hooks/useForm";
import { Form } from "./Form";
import avatarDefault from "../../assets/avatar-default.jpg";
import furnitureDefault from "../../assets/furniture-default.png";
import {
  calculateTotalSpent,
  findNameById,
  formatDate,
  formatPrice,
} from "../../utils";
import { Card, InformationCard, StatisticsCard } from "./Card";
import DataContext from "../../contexts/DataContext";
import { StatusBadge } from "./StatusBadge";

const Modal = ({ isOpen, onClose, children, title, size = "md" }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 backdrop-blur-sm bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`relative bg-white rounded-xl shadow-xl w-full ${sizeClasses[size]} transform transition-all`}
        >
          <div className="relative mb-10">
            <button
              onClick={onClose}
              className="absolute top-2 right-3 cursor-pointer text-black hover:text-gray-600 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          {/* Header */}
          {title && (
            <div className="p-4 flex justify-center border-t-2 border-gray-300">
              <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
            </div>
          )}

          {/* Content */}
          <div className="px-6 pb-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

const ConfirmModal = ({
  isOpen,
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
    </Modal>
  );
};

export const FormModal = ({
  isOpen,
  onClose,
  title = "Chỉnh sửa thông tin",
  children,
  size,
  initialData,
}) => {
  const { formConfig } = useContext(ResourcePageContext);
  const { objectType, keys, onSubmit } = formConfig[objectType] || {};

  const validationRules = createValidationRules(objectType);

  let initialValues = {};
  if (initialData) {
    initialValues = initialData;
  } else {
    keys.forEach((key) => {
      initialValues[key] = "";
    });
  }
  const form = useForm(initialValues, validationRules);

  const handleSubmit = onSubmit
    ? (event) => {
        event.preventDefault();
        onSubmit();
      }
    : null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size={size}>
      <Form form={form} onSubmit={handleSubmit}>
        {keys &&
          keys.map((key, index) => (
            <FormField key={index} name={key} label={labels[index]} required />
          ))}
      </Form>
    </Modal>
  );
};

export const DetailModal = ({
  isOpen,
  onClose,
  data,
  objectType,
  size = "xl",
}) => {
  if (!data) return null;

  let modal;
  switch (objectType) {
    case "customer":
      modal = (
        <CustomerDetailModal
          isOpen={isOpen}
          onClose={onClose}
          data={data}
          size={size}
        />
      );
      break;
    case "product":
      modal = (
        <ProductDetailModal
          isOpen={isOpen}
          onClose={onClose}
          data={data}
          size={size}
        />
      );
      break;
    case "order":
      modal = (
        <OrderDetailModal
          isOpen={isOpen}
          onClose={onClose}
          data={data}
          size={size}
        />
      );
      break;
    default:
      modal = <div>Unsupported object type</div>;
  }
  return <>{modal}</>;
};

const CustomerDetailModal = ({
  isOpen,
  onClose,
  data,
  title = "Chi tiết khách hàng",
  size = "xl",
}) => {
  if (!data) return null;
  console.log(data);

  const Information = () => {
    const { avatar, full_name, email, phone, address, created_at } = data;
    return (
      <div className="flex gap-4 mb-6">
        <img
          src={avatar || avatarDefault}
          alt="avatar"
          className="w-24 h-24 rounded-full object-cover"
          onError={(e) => {
            e.target.src = avatarDefault;
          }}
        />
        <div>
          <h2 className="text-2xl font-bold mb-2">{full_name}</h2>
          <div className="text-black mb-1 flex gap-2 items-center">
            <FaEnvelope />
            <span>Email: {email}</span>
          </div>
          <div className="text-black mb-1 flex gap-2 items-center">
            <FaPhone /> <span>Số điện thoại: {phone}</span>
          </div>
          <div className="text-black mb-1 flex gap-2 items-center">
            <FaLocationDot /> <span>Địa chỉ: {address}</span>
          </div>
          <div className="text-black mb-1 flex gap-2 items-center">
            <FaCalendar />
            <span>Ngày tham gia: {formatDate(created_at)}</span>
          </div>
        </div>
      </div>
    );
  };

  const Statistic = () => {
    const orders = data.orders || [];
    const totalOrders = orders.length || "0";
    const totalSpent = calculateTotalSpent(orders) || "0";
    const avgOrderValue =
      totalOrders > 0 ? (totalSpent / totalOrders).toFixed(2) : "0";
    const recentOrder =
      orders.length > 0 ? formatDate(orders[0].order_date) : "N/A";
    return (
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatisticsCard title="Tổng đơn hàng" content={totalOrders} />
        <StatisticsCard
          title="Tổng chi tiêu"
          content={formatPrice(totalSpent)}
        />
        <StatisticsCard
          title="Giá trị TB"
          content={formatPrice(avgOrderValue)}
        />
        <StatisticsCard title="Đơn gần nhất" content={recentOrder} />
      </div>
    );
  };

  const OrdersTable = () => {
    const orders = data.orders || [];
    if (orders.length === 0) {
      return <p>Khách hàng chưa có đơn hàng nào.</p>;
    }
    return (
      <div className="overflow-x-auto rounded-lg bg-gray-100 border border-gray-300 p-4">
        <h3 className="font-semibold text-lg text-left mb-4">
          Lịch sử đơn hàng
        </h3>
        <table className="border border-gray-300 w-full rounded-2xl">
          <thead className="bg-gray-100">
            <tr>
              <td className="px-4 py-2 border-b border-gray-300 text-left">
                Mã đơn hàng
              </td>
              <td className="px-4 py-2 border-b border-gray-300 text-left">
                Ngày đặt
              </td>
              <td className="px-4 py-2 border-b border-gray-300 text-left">
                Tổng tiền
              </td>
              <td className="px-4 py-2 border-b border-gray-300 text-left">
                Trạng thái
              </td>
            </tr>
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b border-gray-300">
                  {order.order_number}
                </td>
                <td className="px-4 py-2 border-b border-gray-300">
                  {formatDate(order.order_date)}
                </td>
                <td className="px-4 py-2 border-b border-gray-300">
                  {formatPrice(order.total_amount)}
                </td>
                <td className="px-4 py-2 border-b border-gray-300">
                  <StatusBadge>{order.status}</StatusBadge>
                </td>
              </tr>
            ))}
          </thead>
        </table>
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size={size}>
      <Information />
      <Statistic />
      <OrdersTable />
    </Modal>
  );
};

const ProductDetailModal = ({
  isOpen,
  onClose,
  data,
  title = "Chi tiết sản phẩm",
  size = "xl",
}) => {
  if (!data) return null;
  console.log(data);

  const Information = () => {
    const { image_url, name, price, description, status } = data;

    return (
      <div className="flex justify-between mb-6">
        <div className="flex gap-4 max-w-xl">
          <img
            src={image_url || furnitureDefault}
            alt="image"
            className="w-36 h-36 rounded-lg object-cover"
            onError={(e) => {
              e.target.src = furnitureDefault;
            }}
          />
          <div>
            <h2 className="text-2xl font-bold">{name}</h2>
            <div className="text-black flex gap-2 items-center">
              <span>{description}</span>
            </div>
          </div>
        </div>
        <div className="gap-2 text-right">
          <h2 className="text-2xl font-bold text-gray-900">
            {formatPrice(price)}
          </h2>
          <StatusBadge >{status}</StatusBadge>
        </div>
      </div>
    );
  };

  const DetailCard = () => {
    const { material, stock_quantity, created_at, color, dimensions } = data;

    const content = {
      material: {
        Icon: <FaScissors className="text-green-700" />,
        label: "Chất liệu",
        value: material,
      },
      stock_quantity: {
        Icon: <FaBoxesStacked className="text-blue-700" />,
        label: "Số lượng tồn",
        value: stock_quantity,
      },
      created_at: {
        Icon: <FaClock className="text-black" />,
        label: "Ngày tạo",
        value: formatDate(created_at),
      },
      color: {
        Icon: <FaPalette className="text-orange-700" />,
        label: "Màu sắc",
        value: color,
      },
      dimensions: {
        Icon: <FaRuler className="text-yellow-700" />,
        label: "Kích thước",
        value: dimensions,
      },
    };

    return <InformationCard title="Thông tin chi tiết" content={content} />;
  };

  const Statistics = () => {
    const { order_details } = data || [];

    const totalSold =
      (order_details &&
        order_details.reduce((sum, detail) => sum + detail.quantity, 0)) ||
      "0";

    const revenue =
      (order_details &&
        order_details.reduce((sum, detail) => sum + detail.total_price, 0)) ||
      "0";

    return (
      <>
        <StatisticsCard
          title="Tổng số hàng đã bán"
          content={totalSold}
          Icon={{ icon: FaBoxesStacked, color: "text-blue-600" }}
        />
        <StatisticsCard
          title="Tổng doanh thu"
          content={formatPrice(revenue)}
          Icon={{ icon: FaCoins, color: "text-green-600" }}
        />
      </>
    );
  };

  const OrderTable = () => {
    const { order_details } = data || [];
    const orders = useContext(DataContext).data.orders || [];

    if (order_details.length === 0) {
      return <p>Sản phẩm chưa có đơn hàng nào.</p>;
    }

    const filteredOrders = orders.filter((order) => order_details.some((detail) => detail.order_id === order.id));

    if (filteredOrders.length === 0) {
      return <p>Sản phẩm chưa có đơn hàng nào.</p>;
    }
    return (
      <div className="overflow-x-auto rounded-lg bg-gray-100 border border-gray-300 p-4">
        <h3 className="font-semibold text-lg text-left mb-4">
          Lịch sử đơn hàng
        </h3>
        <table className="border border-gray-300 w-full rounded-2xl">
          <thead className="bg-gray-100">
            <tr>
              <td className="px-4 py-2 border-b border-gray-300 text-left">
                Mã đơn hàng
              </td>
              <td className="px-4 py-2 border-b border-gray-300 text-left">
                Ngày đặt
              </td>
              <td className="px-4 py-2 border-b border-gray-300 text-left">
                Tổng tiền
              </td>
              <td className="px-4 py-2 border-b border-gray-300 text-left">
                Trạng thái
              </td>
            </tr>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b border-gray-300">
                  {order.order_number}
                </td>
                <td className="px-4 py-2 border-b border-gray-300">
                  {formatDate(order.order_date)}
                </td>
                <td className="px-4 py-2 border-b border-gray-300">
                  {formatPrice(order.total_amount)}
                </td>
                <td className="px-4 py-2 border-b border-gray-300">
                  <StatusBadge>{order.status}</StatusBadge>
                </td>
              </tr>
            ))}
          </thead>
        </table>
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size={size}>
      <Information />
      <div className="grid grid-cols-3 gap-4 mb-4">
        <DetailCard />
        <Statistics />
      </div>
      <OrderTable />
    </Modal>
  );
};

const OrderDetailModal = ({
  isOpen,
  onClose,
  data,
  title = "Chi tiết đơn hàng",
  size = "xl",
}) => {
  if (!data) return <p>Loading...</p>;

  const Information = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <div className="gap-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Đơn hàng {data.order_number}
          </h3>
          <p className="text-sm text-black">
            Đặt lúc: {formatDate(data.order_date)}
          </p>
        </div>
        <div className="gap-2 text-right">
          <h2 className="text-2xl font-bold text-gray-900 mt-4">
            {formatPrice(data.total_amount)}
          </h2>
          <StatusBadge >{data.status}</StatusBadge>
        </div>
      </div>
    );
  };

  const CustomerCard = () => {
    const customer = data.customer || {};
    if (!customer) return null;

    const content = {
      name: {
        Icon: <FaAddressCard className="text-green-900" />,
        value: customer.full_name,
      },
      phone: {
        Icon: <FaPhone className="text-blue-700" />,
        value: customer.phone,
      },
      email: {
        Icon: <FaEnvelope className="text-green-700" />,
        value: customer.email,
      },
      address: {
        Icon: <FaLocationDot className="text-orange-700" />,
        value: data.shipping_address,
      },
    };

    return <InformationCard title="Thông tin khách hàng" content={content} />;
  };

  const OrderCard = () => {
    if (!data) return null;

    const content = {
      notes: {
        Icon: <FaNoteSticky className="text-yellow-400" />,
        value: data.notes,
      },
    };

    return <InformationCard title="Thông tin đơn hàng" content={content} />;
  };

  const ProductList = () => {
    const { order_details } = data || [];

    const products = useContext(DataContext).data.products || [];

    const details = order_details.map((detail) => {
      const product_name = findNameById("product", detail.product_id, products);
      const product_image =
        products.find((p) => p.id === detail.product_id).image_url ||
        furnitureDefault;
      return { ...detail, product_name, product_image };
    });

    if (!order_details || order_details.length === 0) {
      return <p>Không có sản phẩm nào trong đơn hàng.</p>;
    }
    return (
      <div className="overflow-x-auto rounded-lg border border-gray-300 mb-4 gap-2 p-4 bg-gray-50 hover:shadow-lg">
        <div className="gap-1">
          <h3 className="text-lg font-semibold text-gray-900">
            Sản phẩm đặt mua
          </h3>
          <p className="text-sm text-black mb-2">({details.length} sản phẩm)</p>
        </div>
        <div>
          {details.map((detail, index) => {
            return (
              <div
                key={index}
                className="flex justify-between items-center border-b border-gray-300 p-2 hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={detail.product_image || furnitureDefault}
                    alt={detail.product_name}
                    className="w-16 h-16 object-cover"
                    onError={(e) => {
                      e.target.src = furnitureDefault;
                    }}
                  />
                  <div>
                    <p>{detail.product_name}</p>
                    <p>Số lượng: {detail.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    {formatPrice(detail.unit_price)}
                  </p>
                  <p>Tổng: {formatPrice(detail.total_price)}</p>
                </div>
              </div>
            );
          })}
          <div className="p-2 flex justify-between">
            <p className="text-right text-lg">Tổng cộng: </p>
            <p className="text-right text-lg text-black">
              {formatPrice(data.total_amount)}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size={size}>
      <Information />
      <div className="grid grid-cols-2 gap-4 mb-4">
        <CustomerCard />
        <OrderCard />
      </div>
      <ProductList />
    </Modal>
  );
};

export const Modals = () => {
  const { modals, closeModal } = useContext(ModalContext);
  const { form, confirm, detail } = modals || {};
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
    </>
  );
};
