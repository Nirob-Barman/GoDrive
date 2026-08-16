import { useState } from "react";
import {
  useApproveReservationMutation,
  useGetAllReservationsQuery,
  useMarkPickedUpMutation,
  useRejectReservationMutation,
  useReturnCarMutation,
} from "../../redux/features/reservations/reservationsApi";
import { ReservationStatusBadge, PaymentStatusBadge } from "../../components/ui/StatusBadge";
import PageHeader from "../../components/ui/PageHeader";
import EmptyState from "../../components/ui/EmptyState";
import { SkeletonRows } from "../../components/ui/Skeleton";
import type { TReservation, TReservationStatus } from "../../types/reservations";
import { getErrorMessage } from "../../utils/getErrorMessage";

const STATUS_TABS: Array<{ label: string; value: TReservationStatus | "" }> = [
  { label: "All", value: "" },
  { label: "Pending", value: "Pending" },
  { label: "Approved", value: "Approved" },
  { label: "Picked Up", value: "PickedUp" },
  { label: "Returned", value: "Returned" },
  { label: "Rejected", value: "Rejected" },
  { label: "Cancelled", value: "Cancelled" },
];

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
          <button type="button" className="btn btn-primary btn-sm" onClick={() => approve(reservation.id)} disabled={isApproving}>
            Approve
          </button>
          <button type="button" className="btn btn-danger btn-sm" onClick={handleReject} disabled={isRejecting}>
            Reject
          </button>
        </>
      )}
      {reservation.status === "Approved" && (
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => markPickedUp(reservation.id)}
          disabled={isPickingUp || reservation.paymentStatus !== "Paid"}
          title={reservation.paymentStatus !== "Paid" ? "Payment must be completed first" : undefined}
        >
          Mark Picked Up
        </button>
      )}
      {reservation.status === "PickedUp" && (
        <button type="button" className="btn btn-primary btn-sm" onClick={() => returnCar(reservation.id)} disabled={isReturning}>
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
      <PageHeader title="Manage Reservations" subtitle="Approve, reject, and track the rental lifecycle." />

      <div className="status-tabs">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.label}
            type="button"
            className={`status-tab${status === tab.value ? " active" : ""}`}
            onClick={() => {
              setStatus(tab.value);
              setPageNumber(1);
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading && <SkeletonRows count={4} />}

      {data && data.items.length === 0 && (
        <EmptyState title="No reservations match this filter" />
      )}

      {data && data.items.length > 0 && (
        <ul className="reservation-list">
          {data.items.map((reservation) => (
            <li key={reservation.id} className="reservation-row">
              <div>
                <h2>
                  #{reservation.id} &middot; {reservation.carName}
                </h2>
                <div className="reservation-meta-row">
                  <ReservationStatusBadge status={reservation.status} />
                  <PaymentStatusBadge status={reservation.paymentStatus} />
                </div>
                <p className="text-sm" style={{ marginTop: "6px" }}>
                  {new Date(reservation.pickupDate).toLocaleString()} &rarr;{" "}
                  {new Date(reservation.dropoffDate).toLocaleString()}
                </p>
                <p className="car-card-price">${reservation.totalAmount.toFixed(2)}</p>
              </div>
              <ReservationActions reservation={reservation} />
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
    </div>
  );
}
