import type { Order } from "../../types/order";
import type { FiltersState } from "../filters/filtersSlice";

export function selectVisibleOrders(orders: Order[], filters: FiltersState): Order[] {
  const query = filters.query.trim().toLowerCase();

  const filtered = orders.filter((order) => {
    // "Show archived" is a dedicated view, not an additional filter: the
    // workspace either shows active orders or archived orders, never both.
    if (order.archived !== filters.showArchived) return false;

    if (filters.status !== "all" && order.status !== filters.status) {
      return false;
    }

    if (query) {
      const haystack = `${order.id} ${order.customer}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (filters.sort) {
      case "date_asc":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "date_desc":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "amount_asc":
        return a.amount - b.amount;
      case "amount_desc":
        return b.amount - a.amount;
      default:
        return 0;
    }
  });

  return sorted;
}
