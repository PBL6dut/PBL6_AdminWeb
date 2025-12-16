import { createContext, useCallback, useContext, useState } from "react";
// import DataContext from "./DataContext";
import Customer from "../components/ui/modal/detail/Customer";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState({
    isOpen: false,
    childComponent: null,
    title: "",
    size: "",
  });

  // Generic modal actions
  const openModal = useCallback((childComponent, title, size) => {
    setModal({
      isOpen: true,
      childComponent,
      title,
      size,
    });
  }, []);

  const closeModal = useCallback(() => {
    setModal({
      isOpen: false,
      childComponent: null,
    });
  }, []);

  const closeAllModals = useCallback(() => {
    setModal({
      isOpen: false,
      childComponent: null,
    });
  }, []);

  const value = {
    // Generic actions
    openModal,
    closeModal,
    closeAllModals,
    modal,
  };

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};

export default ModalContext;
