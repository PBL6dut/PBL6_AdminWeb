import { useContext, useEffect, useReducer } from "react";
import { getAllCustomers } from "../services/userService";
import { getAllOrders } from "../services/orderService";
import { getAllProducts, getAllCategories } from "../services/productService";
import AuthContext from "../contexts/AuthContext";
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
  const { isAuthenticated } = useContext(AuthContext);

  const fetchData = async () => {
    dispatch({ type: "FETCH_START" });
    try {
      const [customersRes, ordersRes, productsRes, categoriesRes] = await Promise.all([
        getAllCustomers(),
        getAllOrders(),
        getAllProducts(),
        getAllCategories(),
      ]);

      if (customersRes && ordersRes && productsRes && categoriesRes) {
        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            customers: customersRes.data,
            orders: ordersRes.data,
            products: productsRes.data,
            categories: categoriesRes.data,
          },
        });
      }
    } catch (error) {
      dispatch({ type: "FETCH_ERROR", payload: error.message });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);
  console.log(state.customers || state.error);

  return {
    isLoading: state.isLoading,
    error: state.error,
    customers: state.customers,
    orders: state.orders,
    products: state.products,
    categories: state.categories,
  };
};
