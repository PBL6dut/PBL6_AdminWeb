import { apiSlice } from "./baseApi";

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: ({ page }) => ({
        url: "/orders",
        params: { page },
      }),
      providesTags: ["Orders"],
      transformResponse: (response) => response.data, // Assuming the response is wrapped in a data object
    }),
    getOrderById: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: "Orders", id }],
    }),
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "/orders",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Orders"],
    }),
    updateOrder: builder.mutation({
      query: ({ id, orderData }) => ({
        url: `/orders/${id}`,
        method: "PUT",
        body: orderData,
      }),
      invalidatesTags: ["Orders"],
    }),
    countOrders: builder.query({
      query: () => "/orders/count",
      providesTags: ["Orders"],
      transformResponse: (response) => response.data,
    }),
    getTotalIncome: builder.query({
      query: () => "/orders/total-income",
      providesTags: ["Orders"],
      transformResponse: (response) => response.data,
    }),
    getOrderStatistics: builder.query({
      query: () => "/orders/statistics",
      providesTags: ["Orders"],
      transformResponse: (response) => response.data,
    }),
    cancelOrder: builder.mutation({
      query: (id) => ({
        url: `/orders/cancel/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useCountOrdersQuery,
  useGetTotalIncomeQuery,
  useCancelOrderMutation,
  useGetOrderStatisticsQuery,
} = orderApi;
