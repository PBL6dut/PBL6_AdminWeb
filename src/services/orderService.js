import axios from "./axios";

export const getAllOrders = async (page=1, limit=10) => {
    try {
        const response = await axios.get(`/orders?page=${page}&pageSize=${limit}`);
        return response;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
}

export const getOrderById = async (id) => {
    try {
        const response = await axios.get(`/orders/${id}`);
        return response;
    } catch (error) {
        console.error("Error fetching order:", error);
        throw error;
    }
}

export const countOrders = async () => {
    try {
        const response = await axios.get("/orders/count");
        return response;
    } catch (error) {
        console.error("Error counting orders:", error);
        throw error;
    }   
}