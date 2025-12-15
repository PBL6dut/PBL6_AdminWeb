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

const cardConfigs = (data) => {
  // Đảm bảo data luôn là object với các array
  const safeData = {
    products: Array.isArray(data?.products) ? data.products : [],
    orders: Array.isArray(data?.orders) ? data.orders : [],
    customers: Array.isArray(data?.customers) ? data.customers : [],
  };

  const products = [
    {
      title: "Tổng sản phẩm",
      content: safeData.products.length || "0",
      Icon: { icon: FaCube, color: "text-blue-600" },
    },
    {
      title: "Đang bán",
      content: safeData.products.filter((p) => p.status === "active").length || "0",
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
        safeData.products.filter((p) => p.status === "inactive").length || "0",
      Icon: { icon: FaCircle, color: "text-red-600", size: "w-2 h-2" },
    },
  ];
  const orders = [
    {
      title: "Tổng đơn",
      content: safeData.orders.length || "0",
      Icon: { icon: FaCube },
    },
    {
      title: "Chờ xử lý",
      content: safeData.orders.filter((o) => o.status === "pending").length || "0",
      Icon: { icon: FaRegClock, color: "text-yellow-600 " },
    },
    {
      title: "Đang xử lý",
      content: "2",
      Icon: { icon: FaCube, color: "text-purple-600" },
    },
    {
      title: "Đang giao",
      content: safeData.orders.filter((o) => o.status === "shipping").length || "0",
      Icon: { icon: FaTruck, color: "text-orange-600" },
    },
    {
      title: "Hoàn thành",
      content:
        safeData.orders.filter((o) => o.status === "completed").length || "0",
      Icon: { icon: FaRegCircleCheck, color: "text-green-600" },
    },
    {
      title: "Đã huỷ",
      content:
        safeData.orders.filter((o) => o.status === "cancelled").length || "0",
      Icon: { icon: FaRegCircleXmark, color: "text-red-600" },
    },
  ];
  const customers = [
    {
      title: "Tổng KH",
      content: safeData.customers.length || "0",
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
  return { products, orders, customers };
};

export default cardConfigs;