import { createContext, useContext } from 'react';

const FormContext = createContext();

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('Form components must be used within FormProvider');
  }
  return context;
};

export const FormProvider = ({ children, form }) => {
  return (
    <FormContext.Provider value={form}>
      {children}
    </FormContext.Provider>
  );
};