import { useState } from "react";
import {
  useCancelReservationMutation,
  useGetMyReservationsQuery,
  useUpdateReservationMutation,
} from "../../redux/features/reservations/reservationsApi";
import { useCreateCheckoutSessionMutation } from "../../redux/features/payments/paymentsApi";
import { ReservationStatusBadge, PaymentStatusBadge } from "../../components/ui/StatusBadge";
import PageHeader from "../../components/ui/PageHeader";
import EmptyState from "../../components/ui/EmptyState";
import { SkeletonRows } from "../../components/ui/Skeleton";
import type { TReservation, TReservationStatus } from "../../types/reservations";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { setPendingPaymentReservationId } from "../../utils/pendingPayment";

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
  const [createCheckoutSession, { isLoading: isStartingPayment, error: paymentError }] =
    useCreateCheckoutSessionMutation();

  const canModify = reservation.status === "Pending";
  const canPay = reservation.status === "Approved" && reservation.paymentStatus === "Unpaid";

  const handlePayNow = async () => {
    const session = await createCheckoutSession(reservation.id).unwrap().catch(() => null);
    if (!session) return;

    setPendingPaymentReservationId(reservation.id);
    window.location.href = session.checkoutUrl;
  };

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
        <div className="reservation-meta-row">
          <ReservationStatusBadge status={reservation.status} />
          <PaymentStatusBadge status={reservation.paymentStatus} />
        </div>

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
              <button type="button" className="btn btn-primary btn-sm" onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </button>
              <button type="button" className="btn btn-sm" onClick={() => setIsEditing(false)}>
                Cancel edit
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm" style={{ marginTop: "6px" }}>
            {new Date(reservation.pickupDate).toLocaleString()} &rarr;{" "}
            {new Date(reservation.dropoffDate).toLocaleString()}
          </p>
        )}

        <p className="car-card-price">${reservation.totalAmount.toFixed(2)}</p>

        {paymentError && <p className="form-error">{getErrorMessage(paymentError)}</p>}
        {reservation.status === "Rejected" && reservation.rejectionReason && (
          <p className="form-error">Reason: {reservation.rejectionReason}</p>
        )}
      </div>

      <div className="reservation-actions">
        {canPay && (
          <button type="button" className="btn btn-primary btn-sm" onClick={handlePayNow} disabled={isStartingPayment}>
            {isStartingPayment ? "Redirecting..." : "Pay Now"}
          </button>
        )}
        {canModify && !isEditing && (
          <>
            <button type="button" className="btn btn-sm" onClick={() => setIsEditing(true)}>
              Modify
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => cancelReservation(reservation.id)}
              disabled={isCancelling}
            >
              {isCancelling ? "Cancelling..." : "Cancel"}
            </button>
          </>
        )}
      </div>
    </li>
  );
}

const STATUS_TABS: Array<{ label: string; value: TReservationStatus | "All" }> = [
  { label: "All", value: "All" },
  { label: "Pending", value: "Pending" },
  { label: "Approved", value: "Approved" },
  { label: "Picked Up", value: "PickedUp" },
  { label: "Returned", value: "Returned" },
  { label: "Rejected", value: "Rejected" },
  { label: "Cancelled", value: "Cancelled" },
];

export default function MyReservations() {
  const [pageNumber, setPageNumber] = useState(1);
  const [activeTab, setActiveTab] = useState<TReservationStatus | "All">("All");
  const { data, isLoading, isFetching } = useGetMyReservationsQuery({ pageNumber, pageSize: 10 });

  // The backend's GetMyReservationsQuery has no status filter param - these tabs filter
  // the currently-loaded page client-side rather than adding a new query parameter.
  const visibleItems = data?.items.filter((r) => activeTab === "All" || r.status === activeTab) ?? [];

  return (
    <div>
      <PageHeader title="My Reservations" />

      <div className="status-tabs">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            className={`status-tab${activeTab === tab.value ? " active" : ""}`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading && <SkeletonRows count={3} />}

      {data && visibleItems.length === 0 && (
        <EmptyState
          title={activeTab === "All" ? "You have no reservations yet" : `No ${activeTab} reservations`}
          description={activeTab === "All" ? "Browse cars to make your first booking." : undefined}
        />
      )}

      {visibleItems.length > 0 && (
        <ul className="reservation-list">
          {visibleItems.map((reservation) => (
            <ReservationRow key={reservation.id} reservation={reservation} />
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
