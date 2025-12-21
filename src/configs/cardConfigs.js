import {
  FaCircle,
  FaCoins,
  FaCube,
  FaRegCircleCheck,
  FaRegCircleXmark,
  FaRegClock,
  FaRegStar,
  FaTruck,
  FaUserPlus,
  FaUsers,
} from "react-icons/fa6";

export const getProductStats = (data) => {
  return [
    {
      title: "Tổng sản phẩm",
      content: data?.totalProducts || "0",
      Icon: { icon: FaCube, color: "text-blue-600" },
    },
    {
      title: "Đang bán",
      content: data?.activeProducts || "0",
      Icon: { icon: FaCircle, color: "text-green-600", size: "w-2 h-2" },
    },
    {
      title: "Sắp hết hàng",
      content: data?.almostOutOfStockProducts || "0",
      Icon: { icon: FaCircle, color: "text-yellow-400", size: "w-2 h-2" },
    },
    {
      title: "Hết hàng",
      content: data?.outOfStockProducts || "0",
      Icon: { icon: FaCircle, color: "text-red-600", size: "w-2 h-2" },
    },
  ];
};

export const getCustomerStats = (data) => {
  return [
    {
      title: "Tổng KH",
      content: data.length || "0",
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
  ];
};

export const getOrderStats = (data) => {
  console.log(data);
  return [
    {
      title: "Tổng đơn",
      content: data?.totalOrders || "0",
      Icon: { icon: FaCube },
    },
    {
      title: "Đang xử lý",
      content: data?.pendingOrders || "0",
      Icon: { icon: FaCube, color: "text-purple-600" },
    },
    {
      title: "Đang giao",
      content: data?.shippingOrders || "0",
      Icon: { icon: FaTruck, color: "text-orange-600" },
    },
    {
      title: "Hoàn thành",
      content: data?.completedOrders || "0",
      Icon: { icon: FaRegCircleCheck, color: "text-green-600" },
    },
    {
      title: "Đã huỷ",
      content: data?.cancelledOrders || "0",
      Icon: { icon: FaRegCircleXmark, color: "text-red-600" },
    },
  ];
};
