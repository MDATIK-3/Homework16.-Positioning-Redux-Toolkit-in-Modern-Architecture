import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { OrderStatus } from "../../types/order";
import type { RootState } from "../../app/store";

export type StatusFilter = "all" | OrderStatus;
export type SortMode = "date_desc" | "date_asc" | "amount_desc" | "amount_asc";

export interface FiltersState {
  query: string;
  status: StatusFilter;
  sort: SortMode;
  showArchived: boolean;
}

const initialState: FiltersState = {
  query: "",
  status: "all",
  sort: "date_desc",
  showArchived: false,
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    queryChanged(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    statusChanged(state, action: PayloadAction<StatusFilter>) {
      state.status = action.payload;
    },
    sortChanged(state, action: PayloadAction<SortMode>) {
      state.sort = action.payload;
    },
    showArchivedToggled(state) {
      state.showArchived = !state.showArchived;
    },
    filtersReset(state) {
      state.query = initialState.query;
      state.status = initialState.status;
      state.sort = initialState.sort;
      state.showArchived = initialState.showArchived;
    },
  },
});

export const { queryChanged, statusChanged, sortChanged, showArchivedToggled, filtersReset } =
  filtersSlice.actions;
export default filtersSlice.reducer;

export const selectFilters = (state: RootState) => state.filters;
export const selectQuery = (state: RootState) => state.filters.query;
export const selectStatusFilter = (state: RootState) => state.filters.status;
export const selectSortMode = (state: RootState) => state.filters.sort;
