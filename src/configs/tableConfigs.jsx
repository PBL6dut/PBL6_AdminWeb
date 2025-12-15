import { calculateSum, findNameById, formatDate, formatImageUrl, formatPrice } from "../utils";
import furnitureDefault from "../assets/furniture-default.png";
import avatarDefault from "../assets/avatar-default.jpg";
import { StatusBadge } from "../components/ui/StatusBadge";

const tableConfigs = (data) => {
    // Đảm bảo data luôn an toàn
    const safeData = {
      products: Array.isArray(data?.products) ? data.products : [],
      orders: Array.isArray(data?.orders) ? data.orders : [],
      customers: Array.isArray(data?.customers) ? data.customers : [],
    };

    const products = {
      headings: ["Sản phẩm", "Danh mục", "Giá", "Tồn kho", "Trạng thái"],
      data: safeData.products,
      renderedRows: (item) => [
        <div className="flex">
          <img
            className="size-12 mr-2 rounded-lg"
            src={
              (item.images && formatImageUrl(item.images[0])) ||
              furnitureDefault
            }
            alt={"ảnh"}
            onError={(e) => {
              e.target.src = furnitureDefault;
            }}
          />
          <div>
            <p>{item.name || "N/A"}</p>
            <p>Tạo: {formatDate(item.created_at) || "N/A"}</p>
          </div>
        </div>,
        <>{item.category.name || "N/A"}</>,
        <>{formatPrice(item.price) || "N/A"}</>,
        <>{item.stock_quantity || "N/A"}</>,
        <>{<StatusBadge>{item.status}</StatusBadge> || "N/A"}</>,
      ],
    }

    const orders = {
      headings: [
        "Mã đơn hàng",
        "Khách hàng",
        "Sản phẩm",
        "Tổng tiền",
        "Trạng thái",
      ],
      data: safeData.orders,
      renderedRows: (item) => [
        <div>
          <p>{item.order_number || "N/A"}</p>
          <p>{item.order_date || "N/A"}</p>
        </div>,
        <div>
          <p>{item.customer.full_name || "N/A"}</p>
          <p>{item.customer.phone || "N/A"}</p>
        </div>,
        <>
          <p>{item.order_details.length + " sản phẩm" || "N/A"}</p>
          <p className="text-xs">
            {findNameById(
              "products",
              item.order_details[0].product_id,
              safeData.products
            )}{" "}
            {item.order_details.length > 1 &&
              ` + ${item.order_details.length - 1} sản phẩm khác`}
          </p>
        </>,
        <>{formatPrice(Number(item.total_amount)) || "N/A"}</>,
        <>{<StatusBadge>{item.status}</StatusBadge> || "N/A"}</>,
      ],
    }

    const customers = {
      headings: [
        "Tên khách hàng",
        "Liên hệ",
        "Tổng đơn hàng",
        "Tổng chi tiêu",
        "Đơn gần nhất",
      ],
      data: safeData.customers,
      renderedRows: (item) => [
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
            <p>{item.full_name || "N/A"}</p>
            <p>Tham gia: {formatDate(item.created_at) || "N/A"}</p>
          </div>
        </div>,
        <div>
          <p>{item.email || "N/A"}</p>
          <p>{item.phone || "N/A"}</p>
        </div>,
        <>{item.orders.length}</>,
        <>
          {formatPrice(
            calculateSum(item.orders.map((order) => order.total_amount))
          ) || "N/A"}
        </>,
        <>
          {(item.orders.length && formatDate(item.orders.at(-1).order_date)) ||
            "N/A"}
        </>,
      ],
    }
    return { products, orders, customers };
}

export default tableConfigs;