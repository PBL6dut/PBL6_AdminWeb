import { FaCalendar, FaEnvelope, FaLocationDot, FaPhone } from "react-icons/fa6";
import avatarDefault from "../../../../assets/avatar-default.jpg";
import {
  calculateTotalSpent,
  formatDate,
  formatPrice,
} from "../../../../utils";
import Modal from '../BaseModal'
import { StatisticsCard } from "../../Card";
import { StatusBadge } from "../../StatusBadge";

const Customer = ({
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

export default Customer;