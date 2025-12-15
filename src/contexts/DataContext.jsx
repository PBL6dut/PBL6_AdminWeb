import { createContext, useContext, useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import AuthContext from "./AuthContext";
import { Navigate } from "react-router-dom";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { isLoading, error, customers, orders, products, categories } = useFetch();
  const [data, setData] = useState({ customers: [], orders: [], products: [], categories: [] });
  const { isAuthenticated } = useContext(AuthContext);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

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
    // Sau khi load data xong lần đầu
    if (!isLoading && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [customers, orders, products, categories, isLoading, isInitialLoad]);

  // Hiển thị loading spinner cho lần load đầu tiên
  if (isInitialLoad && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <svg
            className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
              stroke="currentColor"
              strokeWidth="5"
            />
            <path
              d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
              stroke="currentColor"
              strokeWidth="5"
              className="text-blue-900"
            />
          </svg>
          <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // Hiển thị error nếu có lỗi và không có data
  if (error && !data.products.length) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">
            Không thể tải dữ liệu
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
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
        isLoading,
        error
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
