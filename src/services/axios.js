import axios from "axios";

// For Vite use: import.meta.env.VITE_BACKEND_URL
// For Create React App use: process.env.REACT_APP_BACKEND_URL
// Adjust the following line according to your build tool:
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const instance = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  timeout: 10000,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Or wherever you store your token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
