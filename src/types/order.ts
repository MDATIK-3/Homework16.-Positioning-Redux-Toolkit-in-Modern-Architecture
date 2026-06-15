export const ORDER_STATUSES = [
  "new",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: "New",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export interface OrderNote {
  id: string;
  text: string;
  createdAt: string;
}

export interface Order {
  id: string;
  customer: string;
  amount: number;
  status: OrderStatus;
  date: string;
  favorite: boolean;
  archived: boolean;
  notes: OrderNote[];
}
