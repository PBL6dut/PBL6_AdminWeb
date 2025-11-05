import { FaPlus } from "react-icons/fa";
import { createProduct } from "../services/productService";

const headingConfigs = (openModal, closeModal) => {
  const products = {
    title: "Quản lý sản phẩm",
    button: {
      context: "Thêm sản phẩm",
      Icon: FaPlus,
      handleClick: () =>
        openModal("form", {
          title: "Thêm sản phẩm mới",
          onSubmit: async (data)   => {
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
            const response = await createProduct(formData);
            if(response && response.success){
              closeModal("form");
            }else{
              alert("Thêm sản phẩm thất bại");
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
