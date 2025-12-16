import { useLocation } from "react-router-dom";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const calculateTotalAmount = (items) => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

const calculateSum = (values) => {
  values = values.map((value) =>
    typeof value === "string" ? parseFloat(value) : value
  );
  return values.reduce((total, value) => total + value, 0).toString();
};

const calculateTotalSpent = (orders) => {
  return orders.reduce((total, order) => total + Number(order.total_amount), 0);
}

const findNameById = (objectType, id, objectArr) => {
  const object = objectArr.find((item) => item.id === id);
  return object ? object.name : "N/A";
};

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("vi-VN", options);
};

const formatPrice = (price, locale = "vi-VN", currency = "VND") => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(price);
};

const formatImageUrl = (url) => {
  return `${BACKEND_URL}/${url}`;
}

const formatOrderData = (data) => {
  switch(data){
    case "cash_on_delivery":
      return "Thanh toán khi nhận hàng";
    case "bank_transfer":
      return "Chuyển khoản ngân hàng";
    case "credit_card":
      return "Thẻ tín dụng";
    case "e_wallet":
      return "Ví điện tử";
    case "installment":
      return "Trả góp";
    default:
      return "Khác";
    case "standard_delivery":
      return "Giao hàng tiêu chuẩn";
    case "express_delivery":
      return "Giao hàng nhanh";
    case "same_day_delivery":
      return "Giao hàng trong ngày";
    case "pickup_at_store":
      return "Nhận hàng tại cửa hàng";
    case "installation_service":
      return "Dịch vụ lắp đặt";
  }
}

export { calculateTotalAmount, calculateSum, calculateTotalSpent, formatDate, formatPrice, findNameById, formatOrderData, formatImageUrl };
