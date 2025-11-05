import { useContext } from "react";
import DataContext from "../../../../contexts/DataContext";
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
import Modal from '../BaseModal'
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Order = ({
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
          <StatusBadge>{data.status}</StatusBadge>
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
      payment_method: {
        Icon: <FaCreditCard className="text-purple-700" />,
        value: formatOrderData(data.payment_method),
      },
      shipping_method: {
        Icon: <FaTruck className="text-blue-700" />,
        value: formatOrderData(data.shipping_method),
      },
      expected_delivery_date: {
        Icon: <FaCalendar className="text-green-700" />,
        value: formatDate(data.expected_delivery_date),
      },
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
        formatImageUrl(
          products.find((p) => p.id === detail.product_id).images[0]
        ) || furnitureDefault;
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
          <div className="p-2 flex justify-between border-b border-gray-300">
            <p className="text-right text-md">Phí vận chuyển: </p>
            <p className="text-right text-md text-black">
              {formatPrice(data.shipping_fee)}
            </p>
          </div>
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

export default Order;
