import { useState } from "react";
import { Link } from "react-router-dom";
import { useDeleteCarMutation, useGetAllCarsQuery } from "../../redux/features/cars/carsApi";
import { CarStatusBadge } from "../../components/ui/StatusBadge";
import PageHeader from "../../components/ui/PageHeader";
import EmptyState from "../../components/ui/EmptyState";
import { SkeletonRows } from "../../components/ui/Skeleton";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import type { TCarListItem, TCarStatus } from "../../types/cars";
import { getErrorMessage } from "../../utils/getErrorMessage";

export default function ManageCars() {
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [status, setStatus] = useState<TCarStatus | "">("");
  const [pageNumber, setPageNumber] = useState(1);
  const [carPendingDelete, setCarPendingDelete] = useState<TCarListItem | null>(null);

  const { data, isLoading, isFetching } = useGetAllCarsQuery({
    search: appliedSearch || undefined,
    status: status || undefined,
    pageNumber,
    pageSize: 20,
  });
  const [deleteCar, { isLoading: isDeleting, error: deleteError }] = useDeleteCarMutation();

  const handleConfirmDelete = async () => {
    if (!carPendingDelete) return;
    await deleteCar(carPendingDelete.id).catch(() => undefined);
    setCarPendingDelete(null);
  };

  return (
    <div>
      <PageHeader
        title="Manage Cars"
        subtitle="Create, edit, and retire vehicles in the fleet."
        actions={
          <Link to="/admin/cars/new" className="btn btn-primary">
            Add Car
          </Link>
        }
      />

      <form
        className="admin-filter-bar"
        onSubmit={(e) => {
          e.preventDefault();
          setAppliedSearch(search);
          setPageNumber(1);
        }}
      >
        <input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as TCarStatus | "");
            setPageNumber(1);
          }}
        >
          <option value="">All statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Maintenance">Maintenance</option>
        </select>
        <button type="submit" className="btn">
          Search
        </button>
      </form>

      {isLoading && <SkeletonRows count={4} />}
      {deleteError && <p className="form-error">{getErrorMessage(deleteError)}</p>}

      {data && data.items.length === 0 && <EmptyState title="No cars match this filter" />}

      {data && data.items.length > 0 && (
        <ul className="reservation-list">
          {data.items.map((car) => (
            <li key={car.id} className="reservation-row">
              <div>
                <h2>{car.name}</h2>
                <div className="reservation-meta-row">
                  <CarStatusBadge status={car.status} />
                  <span className="text-sm">
                    {car.brand} {car.model} &middot; {car.year}
                  </span>
                </div>
                <p className="car-card-price">${car.pricePerHour.toFixed(2)} / hour</p>
              </div>
              <div className="reservation-actions">
                <Link to={`/admin/cars/${car.id}/edit`} className="btn btn-sm">
                  Edit
                </Link>
                <button type="button" className="btn btn-danger btn-sm" onClick={() => setCarPendingDelete(car)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {data && data.totalPages > 1 && (
        <div className="pagination">
          <button
            type="button"
            className="btn btn-sm"
            disabled={pageNumber <= 1 || isFetching}
            onClick={() => setPageNumber((p) => p - 1)}
          >
            Previous
          </button>
          <span className="text-sm">
            Page {data.pageNumber} of {data.totalPages}
          </span>
          <button
            type="button"
            className="btn btn-sm"
            disabled={pageNumber >= data.totalPages || isFetching}
            onClick={() => setPageNumber((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}

      {carPendingDelete && (
        <ConfirmDialog
          title="Delete car"
          message={`Delete ${carPendingDelete.name}? This can't be undone. Cars with reservation history can't be deleted - deactivate them instead.`}
          confirmLabel="Delete"
          isConfirming={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setCarPendingDelete(null)}
        />
      )}
    </div>
  );
}
