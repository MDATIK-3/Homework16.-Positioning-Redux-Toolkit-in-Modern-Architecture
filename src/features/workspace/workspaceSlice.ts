import { createSlice, createSelector, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

export interface WorkspaceState {
  selectedOrderId: string | null;
  selectedIds: string[];
}

const initialState: WorkspaceState = {
  selectedOrderId: null,
  selectedIds: [],
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    orderSelected(state, action: PayloadAction<string | null>) {
      state.selectedOrderId = action.payload;
    },
    orderSelectionToggled(state, action: PayloadAction<string>) {
      const id = action.payload;
      const index = state.selectedIds.indexOf(id);
      if (index === -1) {
        state.selectedIds.push(id);
      } else {
        state.selectedIds.splice(index, 1);
      }
    },
    allSelectionToggled(state, action: PayloadAction<string[]>) {
      const allIds = action.payload;
      const allSelected = allIds.every((id) => state.selectedIds.includes(id));
      state.selectedIds = allSelected ? [] : allIds;
    },
    selectionCleared(state) {
      state.selectedIds = [];
    },
  },
});

export const {
  orderSelected,
  orderSelectionToggled,
  allSelectionToggled,
  selectionCleared,
} = workspaceSlice.actions;
export default workspaceSlice.reducer;

export const selectSelectedOrderId = (state: RootState) => state.workspace.selectedOrderId;
export const selectSelectedIds = (state: RootState) => state.workspace.selectedIds;

// Derived selector: number of currently selected orders
export const selectSelectionCount = createSelector(
  selectSelectedIds,
  (selectedIds) => selectedIds.length
);

// Derived selector: whether any order is currently selected
export const selectHasSelection = createSelector(
  selectSelectionCount,
  (count) => count > 0
);
