import { configureStore } from "@reduxjs/toolkit";
import filtersReducer from "../features/filters/filtersSlice";
import workspaceReducer from "../features/workspace/workspaceSlice";
import { ordersApi } from "../features/orders/ordersApi";

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
    workspace: workspaceReducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(ordersApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
