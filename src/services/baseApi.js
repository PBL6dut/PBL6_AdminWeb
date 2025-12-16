// src/services/baseApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BACKEND_URL + '/api', // Thay bằng URL thật
  prepareHeaders: (headers, { getState }) => {
    // Lấy token từ Store hoặc LocalStorage
    const token = localStorage.getItem('token') || getState().auth?.token;
    
    // Nếu có token thì đính kèm, không có thì thôi (để public api vẫn chạy được)
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// TẠO 1 API SLICE DUY NHẤT
export const apiSlice = createApi({
  reducerPath: 'api', // Tên slice trong Redux Store
  baseQuery: baseQuery,
  // Khai báo tất cả Tag dùng trong app tại đây
  tagTypes: ['Products', 'Users', 'Orders', 'Categories'], 
  endpoints: () => ({}), // Để rỗng để inject sau
});