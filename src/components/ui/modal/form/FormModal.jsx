import { useContext } from "react";
import ResourcePageContext from "../../../../contexts/ResourcePageContext";
import Modal from '../BaseModal'
import { Form } from "../../Form";

export const FormModal = ({
  isOpen,
  onClose,
  title = "Chỉnh sửa thông tin",
  children,
  onSubmit,
  size,
  initialData={},
}) => {
  const { context } = useContext(ResourcePageContext);
  const { formConfig } = context;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size={size}>
      <Form formSchema={formConfig} onSubmit={onSubmit} initialData={initialData}>
        {children}
      </Form>
    </Modal>
  );
};