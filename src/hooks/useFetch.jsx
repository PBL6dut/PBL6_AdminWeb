import { useEffect, useReducer } from "react";
import { getAllCustomers } from "../services/userService";
import { getAllOrders } from "../services/orderService";
import { getAllProducts } from "../services/productService";

const initialState = {
  isLoading: false,
  error: null,
  customers: [],
  orders: [],
  products: [],
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
      if (
        customersRes &&
        customersRes.status === 200 &&
        ordersRes &&
        ordersRes.status === 200 &&
        productsRes &&
        productsRes.status === 200
      ) {
        const customers = await customersRes.data;
        const orders = await ordersRes.data;
        const products = await productsRes.data;
        console.log(customersRes)
        dispatch({
          type: "FETCH_SUCCESS",
          payload: { customers, orders, products },
        });
      }
    } catch (error) {
      dispatch({ type: "FETCH_ERROR", payload: error.message });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  console.log(state.customers || state.error);

  return {
    isLoading: state.isLoading,
    error: state.error,
    customers: state.customers,
    orders: state.orders,
    products: state.products,
  };
};
