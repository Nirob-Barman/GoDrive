import { useEffect } from "react";
import { Link } from "react-router-dom";
import { clearPendingPaymentReservationId } from "../../utils/pendingPayment";

export default function PaymentCancelled() {
  useEffect(() => {
    clearPendingPaymentReservationId();
  }, []);

  return (
    <div>
      <h1>Payment cancelled</h1>
      <p>You can try again any time from your reservation.</p>
      <p>
        <Link to="/reservations">Go to My Reservations</Link>
      </p>
    </div>
  );
}
