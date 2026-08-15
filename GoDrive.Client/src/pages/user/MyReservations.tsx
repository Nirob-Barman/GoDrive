import { useState } from "react";
import {
  useCancelReservationMutation,
  useGetMyReservationsQuery,
  useUpdateReservationMutation,
} from "../../redux/features/reservations/reservationsApi";
import type { TReservation } from "../../types/reservations";
import { getErrorMessage } from "../../utils/getErrorMessage";

function toDatetimeLocal(isoString: string): string {
  const date = new Date(isoString);
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

function ReservationRow({ reservation }: { reservation: TReservation }) {
  const [isEditing, setIsEditing] = useState(false);
  const [pickupDate, setPickupDate] = useState(() => toDatetimeLocal(reservation.pickupDate));
  const [dropoffDate, setDropoffDate] = useState(() => toDatetimeLocal(reservation.dropoffDate));

  const [cancelReservation, { isLoading: isCancelling }] = useCancelReservationMutation();
  const [updateReservation, { isLoading: isSaving, error }] = useUpdateReservationMutation();

  const canModify = reservation.status === "Pending";

  const handleSave = async () => {
    const result = await updateReservation({
      id: reservation.id,
      pickupDate: new Date(pickupDate).toISOString(),
      dropoffDate: new Date(dropoffDate).toISOString(),
    })
      .unwrap()
      .catch(() => null);

    if (result) {
      setIsEditing(false);
    }
  };

  return (
    <li className="reservation-row">
      <div>
        <h2>{reservation.carName}</h2>
        <p>
          {reservation.status} &middot; Payment: {reservation.paymentStatus}
        </p>

        {isEditing ? (
          <div className="reservation-edit-form">
            <label>
              Pickup
              <input type="datetime-local" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} />
            </label>
            <label>
              Drop-off
              <input type="datetime-local" value={dropoffDate} onChange={(e) => setDropoffDate(e.target.value)} />
            </label>
            {error && <p className="form-error">{getErrorMessage(error)}</p>}
            <div>
              <button type="button" onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </button>
              <button type="button" onClick={() => setIsEditing(false)}>
                Cancel edit
              </button>
            </div>
          </div>
        ) : (
          <p>
            {new Date(reservation.pickupDate).toLocaleString()} &rarr;{" "}
            {new Date(reservation.dropoffDate).toLocaleString()}
          </p>
        )}

        <p className="car-card-price">${reservation.totalAmount.toFixed(2)}</p>

        {reservation.status === "Approved" && reservation.paymentStatus === "Unpaid" && (
          <p>Payment required to proceed (coming in a later update).</p>
        )}
        {reservation.status === "Rejected" && reservation.rejectionReason && (
          <p className="form-error">Reason: {reservation.rejectionReason}</p>
        )}
      </div>

      {canModify && !isEditing && (
        <div className="reservation-actions">
          <button type="button" onClick={() => setIsEditing(true)}>
            Modify
          </button>
          <button type="button" onClick={() => cancelReservation(reservation.id)} disabled={isCancelling}>
            {isCancelling ? "Cancelling..." : "Cancel"}
          </button>
        </div>
      )}
    </li>
  );
}

export default function MyReservations() {
  const [pageNumber, setPageNumber] = useState(1);
  const { data, isLoading, isFetching } = useGetMyReservationsQuery({ pageNumber, pageSize: 10 });

  if (isLoading) {
    return <p>Loading your reservations...</p>;
  }

  return (
    <div>
      <h1>My Reservations</h1>

      {data && data.items.length === 0 && <p>You have no reservations yet.</p>}

      <ul className="reservation-list">
        {data?.items.map((reservation) => (
          <ReservationRow key={reservation.id} reservation={reservation} />
        ))}
      </ul>

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
