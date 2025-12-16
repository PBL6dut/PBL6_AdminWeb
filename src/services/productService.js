import axios from "./axios";

export const getAllProducts = async () => {
  try {
    const response = await axios.get("/products");
    return response;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await axios.get(`/products/${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

export const getAllCategories = async () => {
  try {
    const response = await axios.get("products/categories");
    return response;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await axios.post("/products", productData);
    return response;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const response = await axios.put(`/products/${id}`, productData);
    console.log(response);
    return response;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`/products/${id}`);
    return response;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const countProducts = async () => {
  try {
    const response = await axios.get("/products/count");
    return response;
  } catch (error) {
    console.error("Error counting products:", error);
    throw error;
  }
};
