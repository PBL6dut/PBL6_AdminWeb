import { apiSlice } from "./baseApi";

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ page }) => ({
        url: "/products",
        params: { page },
      }),
      providesTags: (result) => {
        if (result) {
          const final = [
            ...result.data.map(({ id }) => ({ type: "Products", id })),
            { type: "Products", id: "LIST" },
          ];
          return final;
        }
        return [{ type: "Products", id: "LIST" }];
      },
      transformResponse: (response) => response.data, // Assuming the response is wrapped in a data object
    }),
    getCategories: builder.query({
      query: () => "/products/categories",
      providesTags: ["Categories"],
      transformResponse: (response) => response.data,
    }),
    getMostProductsByCategory: builder.query({
      query: () => `/products/most-by-category`,
      providesTags: (result, error, category) => [
        { type: "Products", id: category },
      ],
      transformResponse: (response) => response.data,
    }),
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),
    countProducts: builder.query({
      query: () => "/products/count",
      providesTags: ["Products"],
      transformResponse: (response) => response.data,
    }),
    createProduct: builder.mutation({
      query: (productData) => ({
        url: "/products",
        method: "POST",
        body: productData,
      }),
      invalidatesTags: (result, error, body) => [
        { type: "Products", id: "LIST" },
      ],
    }),
    updateProduct: builder.mutation({
      query: ({ id, productData }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: productData,
      }),
      invalidatesTags: (result, error, { id, productData }) => [
        { type: "Products", id },
        { type: "Products", id: "LIST" },
      ],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Products", id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProductsQuery,
  useGetCategoriesQuery,
  useGetProductByIdQuery,
  useCountProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetMostProductsByCategoryQuery,
} = productApi;
