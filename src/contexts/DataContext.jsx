import { createContext, useEffect, useState } from "react";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const fakeData = {
    products: [
      {
        name: "Ghế da cao cấp",
        created_at: "15/1/2024",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/luxury-leather-sofa-k1OHpdn2pcjrgdkczQaHCOXZFPvO3w.png",
        category: "Ghế sofa",
        price: "12500000đ",
        stock_quantity: 15,
        status: "Đang bán",
      },
      {
        name: "Bộ bàn ăn 6 ghế gỗ sồi",
        created_at: "12/1/2024",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/wooden-dining-set-jBXm0Zvl8jA8SId8u709GLukjvCSjQ.png",
        category: "Bàn ăn",
        price: "8900000đ",
        stock_quantity: 8,
        status: "Đang bán",
      },
      {
        name: "Tủ quần áo 3 cánh gỗ tự nhiên",
        created_at: "10/1/2024",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/wooden-wardrobe-3-doors-GGnoAJDzyJO9Pl4Znbo2kt69jUskjj.png",
        category: "Tủ quần áo",
        price: "15200000đ",
        stock_quantity: 5,
        status: "Đang bán",
      },
    ],
    orders: [
      {
        id: "ORD-2024-001",
        delivery_date: "27/1/2024",
        customers: {name: "Nguyễn Văn An", phone: "0901234567"},
        products: "Ghế sofa cao cấp",
        total: "15.700.000₫",
        status: "Chờ xác nhận",
      },
      {
        id: "ORD-2024-002",
        delivery_date: "25/1/2024",
        customers: {name: "Trần Thị Bình", phone: "0912345678"},
        products: "Bộ bàn ăn gỗ sồi 6 ghế",
        total: "8.900.000₫",
        status: "Đã xác nhận",
      },
      {
        id: "ORD-2024-003",
        customers: {name: "Lê Minh Cường", phone: "0923456789"},
        products: "Tủ quần áo 3 cánh gỗ tự nhiên",
        total: "24.200.000₫",
        status: "Đang xử lý",
      },
    ],
    users: [
      {
        name: "Nguyễn Văn An",
        created_at: "15/6/2023",
        email: "nguyenvanan@email.com",
        phone: "0901234567",
        total_orders: 8,
        total_cost: "45.200.000 ₫",
        latest_order: "20/1/2024",
      },
      {
        name: "Trần Thị Bình",
        created_at: "22/8/2023",
        email: "tranthibinh@email.com",
        phone: "0912345678",
        total_orders: 3,
        total_cost: "18.200.000 ₫",
        latest_order: "19/1/2024",
      },
      {
        name: "Lê Minh Cường",
        created_at: "10/1/2024",
        email: "leminhcuong@email.com",
        phone: "0923456789",
        total_orders: 1,
        total_cost: "24.200.000 ₫",
        latest_order: "18/1/2024",
      },
    ],
  };
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
    setData(fakeData);
  }, []);

  console.log(data);

  return (
    <DataContext.Provider
      value={{
        data,
        setData,
        choosenObject,
        setChoosenObject,
        deleteObject,
        editObject,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
