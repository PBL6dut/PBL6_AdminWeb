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

instance.interceptors.response.use(
  (response) => {
    if(response.data && response.data.success){
      return response.data;
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access, e.g., redirect to login
      console.error("Unauthorized access - perhaps redirect to login?");
    }
    return Promise.reject(error);
  }
);


export default instance;
