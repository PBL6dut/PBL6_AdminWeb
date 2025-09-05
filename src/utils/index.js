import { useLocation } from "react-router-dom";

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
  return orders.reduce((total, order) => total + order.total_amount, 0);
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

export { calculateTotalAmount, calculateSum, calculateTotalSpent, formatDate, formatPrice, findNameById };
