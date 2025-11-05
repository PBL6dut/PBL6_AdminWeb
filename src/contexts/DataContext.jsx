import { createContext, useContext, useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import AuthContext from "./AuthContext";
import { Navigate } from "react-router-dom";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { isLoading, error, customers, orders, products, categories } = useFetch();
  const [data, setData] = useState({ customers: [], orders: [], products: [], categories: [] });
  const { isAuthenticated } = useContext(AuthContext);

  const [choosenObject, setChoosenObject] = useState(null);

  const deleteObject = async (field, object) => {
    setData((prevData) => {
      const newData = { ...prevData };
      newData[field] = newData[field].filter((item) => item !== object);
      return newData;
    });
  };

  const editObject = (field, oldObject, newObject) => {
    setData((prevData) => {
      const newData = { ...prevData };
      newData[field] = newData[field].map((item) =>
        item === oldObject ? newObject : item
      );
      return newData;
    });
  };

  useEffect(() => {
    setData({ customers, orders, products, categories });
  }, [customers, orders, products, categories]);

  if (!isAuthenticated) {
    return null // Redirect to login if not authenticated
  }

  return (
    <DataContext.Provider
      value={{
        data,
        setData,
        choosenObject,
        setChoosenObject,
        deleteObject,
        editObject,
        isLoading
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
