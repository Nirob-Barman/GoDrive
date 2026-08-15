import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGetReservationByIdQuery } from "../../redux/features/reservations/reservationsApi";
import { clearPendingPaymentReservationId, getPendingPaymentReservationId } from "../../utils/pendingPayment";

const POLL_INTERVAL_MS = 2000;
const POLL_TIMEOUT_MS = 40_000;

export default function PaymentReturn() {
  const [reservationId] = useState(() => getPendingPaymentReservationId());
  const [pollingActive, setPollingActive] = useState(true);

  const { data: reservation, isLoading } = useGetReservationByIdQuery(reservationId ?? 0, {
    skip: reservationId === null,
    pollingInterval: pollingActive ? POLL_INTERVAL_MS : 0,
  });

  const isPaid = reservation?.paymentStatus === "Paid";

  useEffect(() => {
    if (isPaid) {
      setPollingActive(false);
      clearPendingPaymentReservationId();
    }
  }, [isPaid]);

  useEffect(() => {
    if (!pollingActive) return;
    const timer = setTimeout(() => setPollingActive(false), POLL_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [pollingActive]);

  if (reservationId === null) {
    return (
      <div>
        <h1>Payment</h1>
        <p>We couldn't determine which reservation this payment was for.</p>
        <p>
          <Link to="/reservations">Go to My Reservations</Link>
        </p>
      </div>
    );
  }

  if (isLoading) {
    return <p>Checking payment status...</p>;
  }

  if (isPaid) {
    return (
      <div>
        <h1>Payment successful</h1>
        <p>Your payment for {reservation!.carName} has been confirmed.</p>
        <p>
          <Link to="/reservations">Go to My Reservations</Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1>Confirming payment...</h1>
      <p>
        Stripe confirms payments asynchronously - this can take a few moments. This page will
        update automatically once it's confirmed.
      </p>
      {!pollingActive && (
        <p>
          Still not confirmed after a while - if you completed payment on Stripe's page, check{" "}
          <Link to="/reservations">My Reservations</Link> shortly; it will update once the
          confirmation arrives.
        </p>
      )}
    </div>
  );
}
