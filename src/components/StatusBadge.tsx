import { ORDER_STATUS_LABELS, type OrderStatus } from "../types/order";

interface StatusBadgeProps {
  status: OrderStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`badge badge--${status}`}>{ORDER_STATUS_LABELS[status]}</span>;
}
