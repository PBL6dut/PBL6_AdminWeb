import { FaPlus } from "react-icons/fa";
import { createProduct } from "../services/productService";

const headingConfigs = (openModal, closeModal, toast = null) => {
  const products = {
    title: "Quản lý sản phẩm",
    button: {
      context: "Thêm sản phẩm",
      Icon: FaPlus,
      handleClick: () =>
        openModal("form", {
          title: "Thêm sản phẩm mới",
          onSubmit: async (data)   => {
            try {
              // Chuyển đổi object từ react-hook-form thành FormData
              const formData = new FormData();
              Object.keys(data).forEach(key => {
                if (key === 'image_url') { // Đổi từ 'image' sang 'image_url' để khớp với formConfigs
                  // FileList object - lặp qua tất cả các file đã chọn
                  for (let i = 0; i < data[key].length; i++) {
                    formData.append('image_url', data[key][i]);
                  }
                } else {
                  formData.append(key, data[key]);
                }
              });

              console.log("📤 Sending product data...");
              const response = await createProduct(formData);
              console.log("📥 Response:", response);

              if(response && response.success){
                if (toast) {
                  toast.success("Thêm sản phẩm thành công!");
                } else {
                  alert("✅ Thêm sản phẩm thành công!");
                }
                closeModal("form");
                // Reload trang để cập nhật danh sách
                setTimeout(() => window.location.reload(), 1000);
              } else {
                // Hiển thị lỗi từ backend
                const errorMessage = response.error
                  ? Array.isArray(response.error)
                    ? response.error.join('\n')
                    : response.error
                  : response.message || "Thêm sản phẩm thất bại";

                if (toast) {
                  toast.error(errorMessage);
                } else {
                  alert(`❌ Lỗi:\n\n${errorMessage}`);
                }
                console.error("Backend error:", response);
              }
            } catch (error) {
              console.error("Error creating product:", error);
              const errorMsg = error.response?.data?.error
                ? Array.isArray(error.response.data.error)
                  ? error.response.data.error.join('\n')
                  : error.response.data.error
                : error.message || "Lỗi không xác định";

              if (toast) {
                toast.error(errorMsg);
              } else {
                alert(`❌ Lỗi:\n\n${errorMsg}`);
              }
            }
          },
        }),
    },
  };

  const orders = {
    title: "Quản lý đơn hàng",
  };

  const customers = {
    title: "Quản lý khách hàng",
    button: { context: "Thêm khách hàng", Icon: FaPlus },
  };
  return { products, orders, customers };
};

export default headingConfigs;
