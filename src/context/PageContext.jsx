import { createContext, useContext, useEffect, useState } from "react";
import { preview } from "vite";

const PageContext = createContext();

const PageProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState("Dashboard");

  const [data, setData] = useState({
    title: "",
  });

  useEffect(() => {
    currentPage === "" 
    ? data = {
        title: "Tổng quan"
    }
    :
    setData((prev) => ({
        ...prev,
        title: currentPage
    }))
  },[currentPage])

  return (
    <PageContext.Provider value={{ data }}>{children}</PageContext.Provider>
  );
};

export const usePageContext = () => {
  return useContext(PageContext);
};
