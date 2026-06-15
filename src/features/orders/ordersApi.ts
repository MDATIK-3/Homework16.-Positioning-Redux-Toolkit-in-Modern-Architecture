import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Order, OrderStatus } from "../../types/order";

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000" }),
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    getOrders: builder.query<Order[], void>({
      query: () => "/orders",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Order" as const, id })),
              { type: "Order" as const, id: "LIST" },
            ]
          : [{ type: "Order" as const, id: "LIST" }],
    }),

    getOrder: builder.query<Order, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Order", id }],
    }),

    updateOrderStatus: builder.mutation<Order, { id: string; status: OrderStatus }>({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Order", id },
        { type: "Order", id: "LIST" },
      ],
    }),

    addOrderNote: builder.mutation<Order, { id: string; text: string }>({
      query: ({ id, text }) => ({
        url: `/orders/${id}/notes`,
        method: "POST",
        body: { text },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Order", id }],
    }),

    toggleOrderFavorite: builder.mutation<Order, { id: string; favorite: boolean }>({
      query: ({ id, favorite }) => ({
        url: `/orders/${id}`,
        method: "PATCH",
        body: { favorite },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Order", id },
        { type: "Order", id: "LIST" },
      ],
    }),

    // The mock API has no bulk endpoint, so this issues one PATCH per id.
    // Sequential is fine here: bulk selections are small and this keeps the
    // mutation atomic-ish (stop on first error) without extra complexity.
    archiveOrders: builder.mutation<void, { ids: string[]; archived: boolean }>({
      async queryFn({ ids, archived }, _api, _extra, baseQuery) {
        for (const id of ids) {
          const result = await baseQuery({
            url: `/orders/${id}`,
            method: "PATCH",
            body: { archived },
          });
          if (result.error) return { error: result.error };
        }
        return { data: undefined };
      },
      invalidatesTags: [{ type: "Order", id: "LIST" }],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderQuery,
  useUpdateOrderStatusMutation,
  useAddOrderNoteMutation,
  useToggleOrderFavoriteMutation,
  useArchiveOrdersMutation,
} = ordersApi;
