import axios from "./axios";

export const getAllProducts = async () => {
    try {
        const response = await axios.get("/product/list");
        return response;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
}

export const getProductById = async (id) => {
    try {
        const response = await axios.get(`/product/${id}`);
        return response;
    } catch (error) {
        console.error("Error fetching product:", error);
        throw error;
    }
}

export const getAllCategories = async () => {
    try {
        const response = await axios.get("/category/list");
        return response;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
}