import axios from "./axios";

export const getAllProducts = async () => {
    try {
        const response = await axios.get("/products");
        return response;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
}

export const getProductById = async (id) => {
    try {
        const response = await axios.get(`/products/${id}`);
        return response;
    } catch (error) {
        console.error("Error fetching product:", error);
        throw error;
    }
}

export const getAllCategories = async () => {
    try {
        const response = await axios.get("products/categories");
        return response;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
}

export const createProduct = async (productData) => {
    try {
        const response = await axios.post("/products", productData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        console.error("Error creating product:", error);
        // Return error response thay vì throw để headingConfigs có thể xử lý
        if (error.response) {
            return error.response.data;
        }
        throw error;
    }
}

export const updateProduct = async (id, productData) => {
    try {
        const response = await axios.put(`/products/${id}`, productData);
        console.log(response)
        return response;
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
}

export const deleteProduct = async (id) => {
    try {
        const response = await axios.delete(`/products/${id}`);
        return response;
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
    }
}


