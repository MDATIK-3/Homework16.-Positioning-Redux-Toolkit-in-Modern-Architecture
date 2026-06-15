import type { Order } from "../types/order";
import { formatCurrency, formatDate } from "../utils/format";
import { StatusBadge } from "./StatusBadge";

interface OrderRowProps {
  order: Order;
  isActive: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onToggleSelection: () => void;
}

export function OrderRow({
  order,
  isActive,
  isSelected,
  onSelect,
  onToggleSelection,
}: OrderRowProps) {
  return (
    <li className={`order-row ${isActive ? "order-row--active" : ""}`}>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onToggleSelection}
        aria-label={`Select order ${order.id}`}
      />
      <button type="button" className="order-row__main" onClick={onSelect}>
        <span className="order-row__id">{order.id}</span>
        <span className="order-row__customer">{order.customer}</span>
        <span className="order-row__amount">{formatCurrency(order.amount)}</span>
        <StatusBadge status={order.status} />
        <span className="order-row__date">{formatDate(order.date)}</span>
        {order.favorite && <span className="order-row__favorite">★</span>}
      </button>
    </li>
  );
}
