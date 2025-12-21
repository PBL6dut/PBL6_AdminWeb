import { Form } from "../components/ui/Form";
import { getOrderFormSchema, getProductFormSchema } from "./formConfigs";


export const OpenProductFormModal = (openModal, closeModal, item, onSubmit, categories=[]) => {
  const formSchema = getProductFormSchema(item, categories);
  return openModal(
    <Form formSchema={formSchema} onClose={closeModal} onSubmit={onSubmit} />,
    "Chỉnh sửa thông tin sản phẩm",
    "lg"
  );
};

export const OpenOrderFormModal = (openModal, closeModal, item, onSubmit) => {
  const formSchema = getOrderFormSchema(item);
  return openModal(
    <Form formSchema={formSchema} onSubmit={onSubmit} onClose={closeModal} />,
    "Chỉnh sửa trạng thái đơn hàng",
    "md"
  );
};