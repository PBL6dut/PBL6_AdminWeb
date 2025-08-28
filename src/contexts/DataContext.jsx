import { createContext, useEffect, useState } from "react"

const DataContext = createContext()

export const DataProvider = ({ children }) => {
    const [data, setData] = useState(null);
    const fakeData = {
        products: [
            {name: "Ghế da cao cấp", category: "Ghế sofa", price: "12500000đ", stock_quantity: 15, status: "Đang bán"},
            {name: "Bộ bàn ăn 6 ghế gỗ sồi", category: "Bàn ăn", price: "8900000đ", stock_quantity: 8, status: "Đang bán"},
            {name: "Tủ quần áo 3 cánh gỗ tự nhiên", category: "Tủ quần áo", price: "15200000đ", stock_quantity: 5, status: "Đang bán"}, 
        ],
        orders: [
            {id: "ORD-2024-001", customers: "Nguyễn Văn An", products: "Ghế sofa cao cấp", total: "15.700.000₫", status: "Chờ xác nhận"},
            {id: "ORD-2024-002", customers: "Trần Thị Bình", products: "Bộ bàn ăn gỗ sồi 6 ghế", total: "8.900.000₫", status: "Đã xác nhận"},
            {id: "ORD-2024-003", customers: "Lê Minh Cường", products: "Tủ quần áo 3 cánh gỗ tự nhiên", total: "24.200.000₫", status: "Đang xử lý"},
        ],
        users: [
            {name: "Nguyễn Văn An", email: "nguyenvanan@email.com", total_orders: 8, total_cost: "45.200.000 ₫", latest_order: "20/1/2024"},
            {name: "Trần Thị Bình", email: "tranthibinh@email.com", total_orders: 3, total_cost: "18.200.000 ₫", latest_order: "19/1/2024"},
            {name: "Lê Minh Cường", email: "leminhcuong@email.com", total_orders: 1, total_cost: "24.200.000 ₫", latest_order: "18/1/2024"},
        ]
    }
    const [choosenObject, setChoosenObject] = useState(null);

    useEffect(() => {
        setData(fakeData)
    }, [])

    console.log(data)

    return(
        <DataContext.Provider value={{ data, setData, choosenObject, setChoosenObject }}>
            {children}
        </DataContext.Provider>
    )
}

export default DataContext;