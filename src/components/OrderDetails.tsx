import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  useGetOrderQuery,
  useUpdateOrderStatusMutation,
  useAddOrderNoteMutation,
  useToggleOrderFavoriteMutation,
} from "../features/orders/ordersApi";
import { orderSelected, selectSelectedOrderId } from "../features/workspace/workspaceSlice";
import { ORDER_STATUSES, type OrderStatus } from "../types/order";
import { formatCurrency, formatDateTime } from "../utils/format";

export function OrderDetails() {
  const dispatch = useAppDispatch();
  const selectedOrderId = useAppSelector(selectSelectedOrderId);

  // Local-only draft for the note textarea. It is intentionally not in Redux:
  // it is per-order, ephemeral UI input that disappears once submitted or
  // when the user navigates away, so it has no value outside this component.
  const [noteDraft, setNoteDraft] = useState("");

  const {
    data: order,
    isLoading,
    isError,
  } = useGetOrderQuery(selectedOrderId ?? "", { skip: !selectedOrderId });

  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateOrderStatusMutation();
  const [addNote, { isLoading: isAddingNote }] = useAddOrderNoteMutation();
  const [toggleFavorite, { isLoading: isTogglingFavorite }] = useToggleOrderFavoriteMutation();

  if (!selectedOrderId) {
    return (
      <div className="order-details order-details--empty">
        <p className="state-message">Select an order to see its details.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="order-details">
        <p className="state-message">Loading order...</p>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="order-details">
        <p className="state-message state-message--error">Failed to load this order.</p>
      </div>
    );
  }

  const handleAddNote = async () => {
    const text = noteDraft.trim();
    if (!text) return;
    await addNote({ id: order.id, text });
    setNoteDraft("");
  };

  return (
    <div className="order-details">
      <div className="order-details__header">
        <h2>{order.id}</h2>
        <button type="button" className="btn btn--ghost" onClick={() => dispatch(orderSelected(null))}>
          Close
        </button>
      </div>

      <dl className="order-details__grid">
        <dt>Customer</dt>
        <dd>{order.customer}</dd>

        <dt>Amount</dt>
        <dd>{formatCurrency(order.amount)}</dd>

        <dt>Date</dt>
        <dd>{formatDateTime(order.date)}</dd>

        <dt>Favorite</dt>
        <dd>
          <button
            type="button"
            className="btn btn--small"
            disabled={isTogglingFavorite}
            onClick={() => toggleFavorite({ id: order.id, favorite: !order.favorite })}
          >
            {order.favorite ? "★ Favorited" : "☆ Mark favorite"}
          </button>
        </dd>

        <dt>Status</dt>
        <dd>
          <select
            value={order.status}
            disabled={isUpdatingStatus}
            onChange={(e) =>
              updateStatus({ id: order.id, status: e.target.value as OrderStatus })
            }
          >
            {ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </dd>
      </dl>

      <div className="order-details__notes">
        <h3>Notes</h3>
        {order.notes.length === 0 && <p className="state-message">No notes yet.</p>}
        <ul className="notes-list">
          {order.notes.map((note) => (
            <li key={note.id} className="notes-list__item">
              <p>{note.text}</p>
              <time>{formatDateTime(note.createdAt)}</time>
            </li>
          ))}
        </ul>

        <div className="note-draft">
          <textarea
            placeholder="Write an internal note..."
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            rows={3}
          />
          <button
            type="button"
            className="btn"
            disabled={isAddingNote || !noteDraft.trim()}
            onClick={handleAddNote}
          >
            {isAddingNote ? "Adding..." : "Add note"}
          </button>
        </div>
      </div>
    </div>
  );
}
