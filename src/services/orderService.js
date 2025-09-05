import axios from "./axios";

export const getAllOrders = async () => {
    try {
        const response = await axios.get("/order/list");
        return response;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
}

export const getOrderById = async (id) => {
    try {
        const response = await axios.get(`/order/${id}`);
        return response;
    } catch (error) {
        console.error("Error fetching order:", error);
        throw error;
    }
}