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
      console.log("🔄 Fetching data from API...");
      const [customersRes, ordersRes, productsRes, categoriesRes] = await Promise.all([
        getAllCustomers(),
        getAllOrders(),
        getAllProducts(),
        getAllCategories(),
      ]);

      console.log("📦 API Responses:", {
        customers: customersRes?.data?.length || 0,
        orders: ordersRes?.data?.length || 0,
        products: productsRes?.data?.length || 0,
        categories: categoriesRes?.data?.length || 0,
      });

      console.log("📦 Products Response:", productsRes);

      if (customersRes && ordersRes && productsRes && categoriesRes) {
        // Backend trả về data nested trong data.data
        const customers = customersRes.data?.data || customersRes.data || [];
        const orders = ordersRes.data?.data || ordersRes.data || [];
        const products = productsRes.data?.data || productsRes.data || [];
        const categories = categoriesRes.data?.data || categoriesRes.data || [];

        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            customers,
            orders,
            products,
            categories,
          },
        });
        console.log("✅ Data fetched successfully!", {
          customersCount: customers.length,
          ordersCount: orders.length,
          productsCount: products.length,
          categoriesCount: categories.length
        });
      }
    } catch (error) {
      console.error("❌ Fetch error:", error);
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
