import { updateProduct } from "../services/productService";

const onEditConfigs = (openModal, closeModal) => {
  const products = ({ object }) => {
    openModal(
      "form",
      {
        title: "Chỉnh sửa thông tin sản phẩm",
        onSubmit: async (data) => {
          const keys = Object.keys(data);
          keys.forEach((key) => {
            if (data[key] === object[key]) {
              delete data[key];
            }
          });
          delete data.order_details;
          delete data.images;
          delete data.category;
          const formData = new FormData();
          Object.keys(data).forEach((key) => {
            if (key === "image_url") {
              // Đổi từ 'image' sang 'image_url' để khớp với formConfigs
              // FileList object - lặp qua tất cả các file đã chọn
              for (let i = 0; i < data[key].length; i++) {
                formData.append("image_url", data[key][i]);
              }
            } else {
              formData.append(key, data[key]);
            }
          });
          console.log(data);
          const response = await updateProduct(object.id, formData);
          if (response && response.success) {
            alert("Cập nhật sản phẩm thành công");
            closeModal("form");
          }
        },
        initialData: object,
      },
      "product"
    );
  };

  const orders = ({ object }) => {
    openModal(
      "form",
      {
        initialData: object,
      },
      "order"
    );
  };

  const customers = ({ object }) => {
    openModal(
      "form",
      {
        initialData: object,
      },
      "customer"
    );
  };
  return { products, orders, customers };
};

export default onEditConfigs;
