import { apiSlice } from "./baseApi";
import { countCustomers } from "./userService";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query({
      query: ({ page }) => ({
        url: "/users/customers",
        params: { page },
      }),
      providesTags: ["Users"],
      transformResponse: (response) => response.data, // Assuming the response is wrapped in a data object
    }),
    getCustomerById: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: "Users", id }],
    }),
    createUser: builder.mutation({
      query: (userData) => ({
        url: "/users",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Users"],
    }),
    updateUser: builder.mutation({
      query: ({ id, userData }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: ["Users"],
    }),
    countCustomers: builder.query({
      query: () => "/users/customers/count",
      providesTags: ["Users"],
      transformResponse: (response) => response.data,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCustomersQuery,
  useGetCustomerByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useCountCustomersQuery,
} = userApi;
