import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  queryChanged,
  statusChanged,
  sortChanged,
  showArchivedToggled,
  selectFilters,
  type StatusFilter,
  type SortMode,
} from "../features/filters/filtersSlice";

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "new", label: "New" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: "date_desc", label: "Newest first" },
  { value: "date_asc", label: "Oldest first" },
  { value: "amount_desc", label: "Amount: high to low" },
  { value: "amount_asc", label: "Amount: low to high" },
];

export function FiltersBar() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);

  return (
    <div className="filters-bar">
      <input
        type="text"
        className="filters-search"
        placeholder="Search by id or customer..."
        value={filters.query}
        onChange={(e) => dispatch(queryChanged(e.target.value))}
      />

      <select
        className="filters-select"
        value={filters.status}
        onChange={(e) => dispatch(statusChanged(e.target.value as StatusFilter))}
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        className="filters-select"
        value={filters.sort}
        onChange={(e) => dispatch(sortChanged(e.target.value as SortMode))}
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <label className="filters-archived">
        <input
          type="checkbox"
          checked={filters.showArchived}
          onChange={() => dispatch(showArchivedToggled())}
        />
        Show archived
      </label>
    </div>
  );
}
