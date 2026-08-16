import { useEffect } from "react";
import { Link } from "react-router-dom";
import { clearPendingPaymentReservationId } from "../../utils/pendingPayment";

export default function PaymentCancelled() {
  useEffect(() => {
    clearPendingPaymentReservationId();
  }, []);

  return (
    <div className="hero">
      <span className="badge badge-neutral" style={{ marginBottom: "var(--space-3)" }}>
        Cancelled
      </span>
      <h1>Payment cancelled</h1>
      <p className="hero-subtitle">You can try again any time from your reservation.</p>
      <Link to="/reservations" className="btn btn-primary">
        Go to My Reservations
      </Link>
    </div>
  );
}
