import { createContext, useCallback, useContext, useState } from "react";
import DataContext from "./DataContext";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modals, setModals] = useState({
    form: { isOpen: false, context: null },
    confirm: { isOpen: false, context: null },
    detail: { isOpen: false, context: null, objectType: null },
  });

  const { setChoosenObject } = useContext(DataContext);

  // Generic modal actions
  const openModal = useCallback((modalType, context = null, objectType) => {
    setModals((prev) => ({
      ...prev,
      [modalType]: { isOpen: true, context, objectType },
    }));
  }, []);

  const closeModal = useCallback((modalType) => {
    setModals((prev) => ({
      ...prev,
      [modalType]: { isOpen: false, context: null,  },
    }));
    setChoosenObject(null);
  }, []);

  const closeAllModals = useCallback(() => {
    setModals({
      form: { isOpen: false, context: null },
      confirm: { isOpen: false, context: null },
      detail: { isOpen: false, context: null },
    });
  }, []);

  const value = {
    // Generic actions
    openModal,
    closeModal,
    closeAllModals,

    modals,
  };

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};

export default ModalContext;
