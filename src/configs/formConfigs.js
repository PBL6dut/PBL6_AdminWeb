const formConfigs = (data) => {
  const products = {
    objectType: "sản phẩm",
    name: {
      name: "name",
      label: "Tên sản phẩm",
      type: "text",
      placeholder: "Nhập tên sản phẩm",
      validation: { required: "Tên sản phẩm là bắt buộc" },
    },
    description: {
      name: "description",
      label: "Mô tả",
      type: "textarea",
      placeholder: "Nhập mô tả sản phẩm",
    },
    price: {
      name: "price",
      label: "Giá",
      type: "number",
      placeholder: "Nhập giá sản phẩm",
      validation: {
        required: "Giá là bắt buộc",
        min: { value: 0, message: "Giá không được âm" },
        pattern: { value: /^\d+$/, message: "Giá phải là số nguyên" },
      },
    },
    category_id: {
      name: "category_id",
      label: "Danh mục",
      type: "select",
      options:
        data && data.categories
          ? data.categories.map((category) => ({
              value: category.id,
              label: category.name,
            }))
          : [],
    },
    images: {
      name: "image_url",
      label: "Hình ảnh sản phẩm",
      type: "file",
      multiple: true, // Thêm thuộc tính này để cho phép chọn nhiều file
      validation: { required: "Vui lòng chọn hình ảnh" },
    },
    stock_quantity: {
      name: "stock_quantity",
      label: "Số lượng hàng tồn kho",
      type: "number",
      placeholder: "Nhập số lượng hàng tồn kho",
      validation: {
        required: "Số lượng hàng tồn kho là bắt buộc",
        min: { value: 1, message: "Số lượng hàng tồn kho phải lớn hơn 0" },
      },
    },
    material: {
      name: "material",
      label: "Chất liệu",
      type: "text",
      placeholder: "Nhập chất liệu sản phẩm",
    },
    height: {
      name: "height",
      label: "Chiều cao",
      type: "number",
      placeholder: "Nhập chiều cao sản phẩm",
      validation: {
        required: "Chiều cao là bắt buộc",
        min: { value: 0, message: "Chiều cao không được âm" },
      },
    },
    weight: {
      name: "weight",
      label: "Cân nặng",
      type: "number",
      placeholder: "Nhập cân nặng sản phẩm",
      validation: {
        required: "Cân nặng là bắt buộc",
        min: { value: 0, message: "Cân nặng không được âm" },
      },
    },
    width: {
      name: "width",
      label: "Chiều rộng",
      type: "number",
      placeholder: "Nhập chiều rộng sản phẩm",
      validation: {
        required: "Chiều rộng là bắt buộc",
        min: { value: 0, message: "Chiều rộng không được âm" },
      },
    },
    length: {
      name: "length",
      label: "Chiều dài",
      type: "number",
      placeholder: "Nhập chiều dài sản phẩm",
      validation: {
        required: "Chiều dài là bắt buộc",
        min: { value: 0, message: "Chiều dài không được âm" },
        number: { value: true, message: "Chiều dài phải là số" },
      },
    },
    color: {
      name: "color",
      label: "Màu sắc",
      type: "color",
      placeholder: "Nhập màu sắc sản phẩm",
      validation: {
        required: "Màu sắc là bắt buộc",
        // pattern: {
        //   value: /^[a-zA-Z ]+$/,
        //   message: "Màu sắc không đúng định dạng",
        // },
      },
    },
  };

  const orders = {
    objectType: "orders",
    keys:
      data && data.orders && data.orders.length > 0
        ? Object.keys(data.orders[0]).filter((key) => key !== "status")
        : [],
    labels: ["Mã đơn hàng", "Ngày giao hàng", "Khách hàng", "Tổng tiền"],
    onSubmit: () => {
      alert("Submitted");
    },
  };

  const customers = {
    objectType: "customers",
    keys:
      data && data.customers && data.customers.length > 0
        ? Object.keys(data.customers[0]).filter(
            (key) => key !== "status" && key !== "created_at"
          )
        : [],
    labels: ["Tên khách hàng", "Email", "SĐT", "Tổng chi tiêu", "Đơn gần nhất"],
    onSubmit: () => {
      alert("Submitted");
    },
  };
  return { products, orders, customers };
};

export default formConfigs;
