import { useContext } from "react";
import {
  FaScissors,
  FaBoxesStacked,
  FaClock,
  FaPalette,
  FaRuler,
  FaCoins,
} from "react-icons/fa6";

import furnitureDefault from "../../../../assets/furniture-default.png";
import { formatDate, formatImageUrl, formatPrice } from "../../../../utils";
import { InformationCard, StatisticsCard } from "../../Card";
import { StatusBadge } from "../../StatusBadge";
import Modal from "../BaseModal";

const Product = ({ item }) => {
  if (!item) return null;
  console.log(item);

  const Information = () => {
    const { images, name, price, description, status } = item;
    const getStatusBadge = (status) => {
      if (status === "active") {
        return <StatusBadge variant="bold_green">Đang bán</StatusBadge>;
      } else {
        return <StatusBadge variant="red">Hết hàng</StatusBadge>;
      }
    };

    return (
      <div className="flex justify-between mb-6">
        <div className="flex gap-4 max-w-xl">
          <img
            src={images?.[0].url || furnitureDefault}
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
          {getStatusBadge(status)}
        </div>
      </div>
    );
  };

  const DetailCard = () => {
    const {
      material,
      stock_quantity,
      created_at,
      color,
      height,
      width,
      length,
    } = item;

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
        value: (
          <div
            className="w-6 h-6 rounded-full border border-gray-300"
            style={{ backgroundColor: color }}
          ></div>
        ),
      },
      dimensions: {
        Icon: <FaRuler className="text-yellow-700" />,
        label: "Kích thước",
        value: `${height} x ${width} x ${length} cm`,
      },
    };

    return <InformationCard title="Thông tin chi tiết" content={content} />;
  };

  const Images = () => {
    const { images } = item;
    if (!images || images.length === 0) return null;

    return (
      <div
        className="overflow-x-auto rounded-lg bg-gray-100 border border-gray-300 p-4"
        onError={(e) => {
          e.target.style.display = "none";
        }}
      >
        <h3 className="font-semibold text-lg text-left mb-4">Thư viện ảnh</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images?.map((img, index) => (
            <img
              src={img.url || furnitureDefault}
              key={index}
              className="h-auto max-w-full rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  };

  const Statistics = () => {
    const { order_details } = item || [];

    const totalSold =
      (order_details &&
        order_details.reduce((sum, detail) => sum + detail.quantity, 0)) ||
      "0";

    const revenue =
      (order_details &&
        order_details.reduce(
          (sum, detail) => sum + parseInt(detail.total_price),
          0
        )) ||
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
    const { order_details } = item || [];
    const orders = order_details?.map((detail) => detail.order) || [];

    if (!order_details || order_details.length === 0) {
      return <p>Sản phẩm chưa có đơn hàng nào.</p>;
    }

    const filteredOrders = orders.filter((order) =>
      order_details.some((detail) => detail.order_id === order.id)
    );

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
    <>
      <Information />
      <div className="grid grid-cols-3 gap-4 mb-4">
        <DetailCard />
        <Statistics />
      </div>
      <Images />
      <OrderTable />
    </>
  );
};

export default Product;
