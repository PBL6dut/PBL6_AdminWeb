import { createContext, useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { isLoading, error, customers, orders, products } = useFetch();
  const [data, setData] = useState({ customers: [], orders: [], products: [] });

  const [choosenObject, setChoosenObject] = useState(null);

  const deleteObject = (field, object) => {
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
    setData({ customers, orders, products });
  }, [customers, orders, products]);

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
