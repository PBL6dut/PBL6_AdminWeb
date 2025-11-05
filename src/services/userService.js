import axios from "./axios";

export const getAllCustomers = async () => {
    try {
        const response = await axios.get("/users/customers");
        console.log(response)
        return response;
    } catch (error) {
        console.error("Error fetching customers:", error);
        throw error;
    }
}

export const getCustomerById = async (id) => {
    try {
        const response = await axios.get(`/users/customers/${id}`);
        return response;
    } catch (error) {
        console.error("Error fetching customer:", error);
        throw error;
    }
}