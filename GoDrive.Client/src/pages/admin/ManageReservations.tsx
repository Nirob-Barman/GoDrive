import { useState } from "react";
import {
  useApproveReservationMutation,
  useGetAllReservationsQuery,
  useMarkPickedUpMutation,
  useRejectReservationMutation,
  useReturnCarMutation,
} from "../../redux/features/reservations/reservationsApi";
import type { TReservation, TReservationStatus } from "../../types/reservations";
import { getErrorMessage } from "../../utils/getErrorMessage";

const STATUSES: TReservationStatus[] = ["Pending", "Approved", "PickedUp", "Returned", "Rejected", "Cancelled"];

function ReservationActions({ reservation }: { reservation: TReservation }) {
  const [approve, { isLoading: isApproving, error: approveError }] = useApproveReservationMutation();
  const [reject, { isLoading: isRejecting, error: rejectError }] = useRejectReservationMutation();
  const [markPickedUp, { isLoading: isPickingUp, error: pickupError }] = useMarkPickedUpMutation();
  const [returnCar, { isLoading: isReturning, error: returnError }] = useReturnCarMutation();

  const error = approveError ?? rejectError ?? pickupError ?? returnError;

  const handleReject = () => {
    const reason = window.prompt("Reason for rejection (optional):") ?? undefined;
    reject({ id: reservation.id, reason });
  };

  return (
    <div className="reservation-actions">
      {reservation.status === "Pending" && (
        <>
          <button type="button" onClick={() => approve(reservation.id)} disabled={isApproving}>
            Approve
          </button>
          <button type="button" onClick={handleReject} disabled={isRejecting}>
            Reject
          </button>
        </>
      )}
      {reservation.status === "Approved" && (
        <button
          type="button"
          onClick={() => markPickedUp(reservation.id)}
          disabled={isPickingUp || reservation.paymentStatus !== "Paid"}
          title={reservation.paymentStatus !== "Paid" ? "Payment must be completed first" : undefined}
        >
          Mark Picked Up
        </button>
      )}
      {reservation.status === "PickedUp" && (
        <button type="button" onClick={() => returnCar(reservation.id)} disabled={isReturning}>
          Mark Returned
        </button>
      )}
      {error && <p className="form-error">{getErrorMessage(error)}</p>}
    </div>
  );
}

export default function ManageReservations() {
  const [status, setStatus] = useState<TReservationStatus | "">("");
  const [pageNumber, setPageNumber] = useState(1);

  const { data, isLoading, isFetching } = useGetAllReservationsQuery({
    status: status || undefined,
    pageNumber,
    pageSize: 20,
  });

  return (
    <div>
      <h1>Manage Reservations</h1>

      <select
        value={status}
        onChange={(e) => {
          setStatus(e.target.value as TReservationStatus | "");
          setPageNumber(1);
        }}
      >
        <option value="">All statuses</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {isLoading && <p>Loading reservations...</p>}

      <ul className="reservation-list">
        {data?.items.map((reservation) => (
          <li key={reservation.id} className="reservation-row">
            <div>
              <h2>
                #{reservation.id} &middot; {reservation.carName}
              </h2>
              <p>
                {reservation.status} &middot; Payment: {reservation.paymentStatus}
              </p>
              <p>
                {new Date(reservation.pickupDate).toLocaleString()} &rarr;{" "}
                {new Date(reservation.dropoffDate).toLocaleString()}
              </p>
              <p className="car-card-price">${reservation.totalAmount.toFixed(2)}</p>
            </div>
            <ReservationActions reservation={reservation} />
          </li>
        ))}
      </ul>

      {data && data.items.length === 0 && <p>No reservations match this filter.</p>}

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
