import { Form } from "../components/ui/Form";
import { getProductFormSchema } from "./formConfigs";


export const OpenProductFormModal = (openModal, closeModal, item, onSubmit, categories=[]) => {
  const formSchema = getProductFormSchema(item, categories);
  return openModal(
    <Form formSchema={formSchema} onClose={closeModal} onSubmit={onSubmit} />,
    "Chỉnh sửa thông tin sản phẩm",
    "lg"
  );
};