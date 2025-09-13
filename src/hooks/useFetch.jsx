import { useEffect, useReducer } from "react";
import { getAllCustomers } from "../services/userService";
import { getAllOrders } from "../services/orderService";
import { getAllProducts } from "../services/productService";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const initialState = {
  isLoading: false,
  error: null,
  customers: [],
  orders: [],
  products: [],
  categories: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, isLoading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, isLoading: false, ...action.payload };
    case "FETCH_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const useFetch = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchData = async () => {
    dispatch({ type: "FETCH_START" });
    try {
      const customersRes = await getAllCustomers();
      const ordersRes = await getAllOrders();
      const productsRes = await getAllProducts();
      const categoriesRes = await getAllProducts();
      if (
        customersRes &&
        customersRes.status === 200 &&
        ordersRes &&
        ordersRes.status === 200 &&
        productsRes &&
        productsRes.status === 200 &&
        categoriesRes &&
        categoriesRes.status === 200
      ) {
        const customers = await customersRes.data;
        const orders = await ordersRes.data;
        const products = await productsRes.data;
        const categories = await categoriesRes.data;
        dispatch({
          type: "FETCH_SUCCESS",
          payload: { customers, orders, products, categories },
        });
      }
    } catch (error) {
      dispatch({ type: "FETCH_ERROR", payload: error.message });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  console.log(state.products || state.error);

  return {
    isLoading: state.isLoading,
    error: state.error,
    customers: state.customers,
    orders: state.orders,
    products: state.products,
    categories: state.categories,
  };
};
