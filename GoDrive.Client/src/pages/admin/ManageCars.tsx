import { useState } from "react";
import { Link } from "react-router-dom";
import { useDeleteCarMutation, useGetAllCarsQuery } from "../../redux/features/cars/carsApi";
import type { TCarStatus } from "../../types/cars";
import { getErrorMessage } from "../../utils/getErrorMessage";

export default function ManageCars() {
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [status, setStatus] = useState<TCarStatus | "">("");
  const [pageNumber, setPageNumber] = useState(1);

  const { data, isLoading, isFetching } = useGetAllCarsQuery({
    search: appliedSearch || undefined,
    status: status || undefined,
    pageNumber,
    pageSize: 20,
  });
  const [deleteCar, { isLoading: isDeleting, error: deleteError }] = useDeleteCarMutation();

  return (
    <div>
      <h1>Manage Cars</h1>

      <p>
        <Link to="/admin/cars/new" className="book-now-button">
          Add Car
        </Link>
      </p>

      <form
        className="car-filters"
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
        <button type="submit">Search</button>
      </form>

      {isLoading && <p>Loading cars...</p>}
      {deleteError && <p className="form-error">{getErrorMessage(deleteError)}</p>}

      <ul className="reservation-list">
        {data?.items.map((car) => (
          <li key={car.id} className="reservation-row">
            <div>
              <h2>{car.name}</h2>
              <p>
                {car.brand} {car.model} &middot; {car.year} &middot; {car.status}
              </p>
              <p className="car-card-price">${car.pricePerHour.toFixed(2)} / hour</p>
            </div>
            <div className="reservation-actions">
              <Link to={`/admin/cars/${car.id}/edit`}>Edit</Link>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Delete ${car.name}?`)) {
                    deleteCar(car.id);
                  }
                }}
                disabled={isDeleting}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {data && data.items.length === 0 && <p>No cars match this filter.</p>}

      {data && data.totalPages > 1 && (
        <div className="pagination">
          <button type="button" disabled={pageNumber <= 1 || isFetching} onClick={() => setPageNumber((p) => p - 1)}>
            Previous
          </button>
          <span>
            Page {data.pageNumber} of {data.totalPages}
          </span>
          <button
            type="button"
            disabled={pageNumber >= data.totalPages || isFetching}
            onClick={() => setPageNumber((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
