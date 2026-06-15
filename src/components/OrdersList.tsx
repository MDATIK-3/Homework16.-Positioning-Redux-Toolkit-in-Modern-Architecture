import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useGetOrdersQuery, useArchiveOrdersMutation } from "../features/orders/ordersApi";
import { selectFilters } from "../features/filters/filtersSlice";
import { selectVisibleOrders } from "../features/orders/selectVisibleOrders";
import {
  orderSelected,
  orderSelectionToggled,
  allSelectionToggled,
  selectionCleared,
  selectSelectedOrderId,
  selectSelectedIds,
  selectSelectionCount,
} from "../features/workspace/workspaceSlice";
import { OrderRow } from "./OrderRow";

export function OrdersList() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);
  const selectedOrderId = useAppSelector(selectSelectedOrderId);
  const selectedIds = useAppSelector(selectSelectedIds);
  const selectionCount = useAppSelector(selectSelectionCount);

  const { data: orders, isLoading, isFetching, isError, error } = useGetOrdersQuery();
  const [setArchived, { isLoading: isArchiving }] = useArchiveOrdersMutation();

  const visibleOrders = useMemo(
    () => (orders ? selectVisibleOrders(orders, filters) : []),
    [orders, filters]
  );

  const visibleIds = useMemo(() => visibleOrders.map((order) => order.id), [visibleOrders]);

  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));

  const handleBulkArchiveToggle = async () => {
    // While viewing archived orders the same button "un-archives" the
    // selection instead, so the toolbar always offers the action that
    // moves the current selection out of the active view.
    await setArchived({ ids: selectedIds, archived: !filters.showArchived });
    dispatch(selectionCleared());
  };

  return (
    <div className="orders-list">
      <div className="orders-list__toolbar">
        <label className="select-all">
          <input
            type="checkbox"
            checked={allVisibleSelected}
            onChange={() => dispatch(allSelectionToggled(visibleIds))}
            disabled={visibleIds.length === 0}
          />
          Select all
        </label>

        {selectionCount > 0 && (
          <div className="bulk-actions">
            <span className="bulk-actions__count">{selectionCount} selected</span>
            <button
              type="button"
              className="btn btn--small"
              onClick={() => dispatch(selectionCleared())}
            >
              Clear selection
            </button>
            <button
              type="button"
              className="btn btn--small btn--danger"
              disabled={isArchiving}
              onClick={handleBulkArchiveToggle}
            >
              {isArchiving
                ? "Working..."
                : filters.showArchived
                  ? "Unarchive selected"
                  : "Archive selected"}
            </button>
          </div>
        )}
      </div>

      {isLoading && <p className="state-message">Loading orders...</p>}
      {isError && (
        <p className="state-message state-message--error">
          Failed to load orders{error && "status" in error ? ` (${error.status})` : ""}.
        </p>
      )}
      {!isLoading && !isError && visibleOrders.length === 0 && (
        <p className="state-message">No orders match the current filters.</p>
      )}

      <ul className="orders-list__items">
        {visibleOrders.map((order) => (
          <OrderRow
            key={order.id}
            order={order}
            isActive={order.id === selectedOrderId}
            isSelected={selectedIds.includes(order.id)}
            onSelect={() => dispatch(orderSelected(order.id))}
            onToggleSelection={() => dispatch(orderSelectionToggled(order.id))}
          />
        ))}
      </ul>

      {isFetching && !isLoading && <p className="state-message">Refreshing...</p>}
    </div>
  );
}
