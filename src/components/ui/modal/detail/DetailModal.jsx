import ProductDetailModal from './Product'
import CustomerDetailModal from './Customer'
import OrderDetailModal from './Order'

export const DetailModal = ({
  isOpen,
  onClose,
  data,
  objectType,
  size = "xl",
}) => {
  if (!data) return null;

  let modal;
  switch (objectType) {
    case "customer":
      modal = (
        <CustomerDetailModal
          isOpen={isOpen}
          onClose={onClose}
          data={data}
          size={size}
        />
      );
      break;
    case "product":
      modal = (
        <ProductDetailModal
          isOpen={isOpen}
          onClose={onClose}
          data={data}
          size={size}
        />
      );
      break;
    case "order":
      modal = (
        <OrderDetailModal
          isOpen={isOpen}
          onClose={onClose}
          data={data}
          size={size}
        />
      );
      break;
    default:
      modal = <div>Unsupported object type</div>;
  }
  return <>{modal}</>;
};