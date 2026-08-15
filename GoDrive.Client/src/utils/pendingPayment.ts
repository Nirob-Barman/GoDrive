// Stripe Checkout's redirect only echoes back its own {CHECKOUT_SESSION_ID} placeholder,
// not arbitrary app state - the backend's SuccessUrl/CancelUrl are static, not per-request.
// So the reservation being paid for is stashed here just before the redirect and read back
// on the return page, rather than relying on a query param the return URL can't carry.
const PENDING_PAYMENT_KEY = "godrive:pendingPaymentReservationId";

export function setPendingPaymentReservationId(reservationId: number): void {
  window.localStorage.setItem(PENDING_PAYMENT_KEY, String(reservationId));
}

export function getPendingPaymentReservationId(): number | null {
  const value = window.localStorage.getItem(PENDING_PAYMENT_KEY);
  return value ? Number(value) : null;
}

export function clearPendingPaymentReservationId(): void {
  window.localStorage.removeItem(PENDING_PAYMENT_KEY);
}
