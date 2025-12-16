import { useContext } from "react";
import furnitureDefault from "../../../../assets/furniture-default.png";
import {
  FaEnvelope,
  FaPhone,
  FaLocationDot,
  FaCalendar,
  FaAddressCard,
  FaNoteSticky,
  FaTruck,
  FaCreditCard,
} from "react-icons/fa6";
import {
  findNameById,
  formatDate,
  formatImageUrl,
  formatOrderData,
  formatPrice,
} from "../../../../utils";
import { InformationCard, StatisticsCard } from "../../Card";
import { StatusBadge } from "../../StatusBadge";
import Modal from "../BaseModal";
import { get } from "react-hook-form";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Order = ({ item }) => {
  if (!item) return <p>Loading...</p>;

  const Information = () => {
    const getStatusBadge = (status) => {
      switch (status) {
        case "pending":
          return <StatusBadge variant="yellow">Đang xử lý</StatusBadge>;
        case "cancelled":
          return <StatusBadge variant="red">Đã huỷ</StatusBadge>;
        case "confirmed":
          return <StatusBadge variant="green">Đã xác nhận</StatusBadge>;
        case "shipping":
          return <StatusBadge variant="green">Đang giao</StatusBadge>;
        case "completed":
          return <StatusBadge variant="bold_green">Hoàn thành</StatusBadge>;
      }
    }
    return (
      <div className="flex justify-between items-center mb-4">
        <div className="gap-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Đơn hàng {item.order_number}
          </h3>
          <p className="text-sm text-black">
            Đặt lúc: {formatDate(item.order_date)}
          </p>
        </div>
        <div className="gap-2 text-right">
          <h2 className="text-2xl font-bold text-gray-900 mt-4">
            {formatPrice(item.total_amount)}
          </h2>
          {getStatusBadge(item.status)}
        </div>
      </div>
    );
  };

  const CustomerCard = () => {
    const customer = item.customer || {};
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
        value: item.shipping_address,
      },
    };

    return <InformationCard title="Thông tin khách hàng" content={content} />;
  };

  const OrderCard = () => {
    if (!item) return null;

    const content = {
      payment_method: {
        Icon: <FaCreditCard className="text-purple-700" />,
        value: formatOrderData(item.payment_method),
      },
      shipping_method: {
        Icon: <FaTruck className="text-blue-700" />,
        value: formatOrderData(item.shipping_method),
      },
      expected_delivery_date: {
        Icon: <FaCalendar className="text-green-700" />,
        value: formatDate(item.expected_delivery_date),
      },
      notes: {
        Icon: <FaNoteSticky className="text-yellow-400" />,
        value: item.notes,
      },
    };

    return <InformationCard title="Thông tin đơn hàng" content={content} />;
  };

  const ProductList = () => {
    const { order_details } = item || [];

    const products = order_details.map((detail) => detail.product) || [];

    if (!order_details || order_details.length === 0) {
      return <p>Không có sản phẩm nào trong đơn hàng.</p>;
    }
    return (
      <div className="overflow-x-auto rounded-lg border border-gray-300 mb-4 gap-2 p-4 bg-gray-50 hover:shadow-lg">
        <div className="gap-1">
          <h3 className="text-lg font-semibold text-gray-900">
            Sản phẩm đặt mua
          </h3>
          <p className="text-sm text-black mb-2">({order_details.length} sản phẩm)</p>
        </div>
        <div>
          {products.map((product, index) => {
            return (
              <div
                key={index}
                className="flex justify-between items-center border-b border-gray-300 p-2 hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={product.images?.[0]?.url || furnitureDefault}
                    alt={product.name}
                    className="w-16 h-16 object-cover"
                    onError={(e) => {
                      e.target.src = furnitureDefault;
                    }}
                  />
                  <div>
                    <p>{product.name}</p>
                    <p>Số lượng: {order_details[index].quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    {formatPrice(order_details[index].unit_price)}
                  </p>
                  <p>Tổng: {formatPrice(order_details[index].total_price)}</p>
                </div>
              </div>
            );
          })}
          <div className="p-2 flex justify-between border-b border-gray-300">
            <p className="text-right text-md">Phí vận chuyển: </p>
            <p className="text-right text-md text-black">
              {formatPrice(item.shipping_fee)}
            </p>
          </div>
          <div className="p-2 flex justify-between">
            <p className="text-right text-lg">Tổng cộng: </p>
            <p className="text-right text-lg text-black">
              {formatPrice(item.total_amount)}
            </p>
          </div>
        </div>
      </div>
    );
  };
  return (
    <>
      <Information />
      <div className="grid grid-cols-2 gap-4 mb-4">
        <CustomerCard />
        <OrderCard />
      </div>
      <ProductList />
    </>
  );
};

export default Order;
