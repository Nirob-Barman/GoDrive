export type TPaymentStatus = "Pending" | "Succeeded" | "Failed" | "Refunded";

// Mirrors CleanArchitecture.Application.Payments.Common.PaymentDto
export type TPayment = {
  id: number;
  reservationId: number;
  amount: number;
  currency: string;
  status: TPaymentStatus;
  createdAtUtc: string;
  paidAtUtc: string | null;
};

// Mirrors CleanArchitecture.Application.Payments.Commands.CreateCheckoutSession.CheckoutSessionDto
export type TCheckoutSession = {
  sessionId: string;
  checkoutUrl: string;
};

export type TPaymentFilters = {
  pageNumber?: number;
  pageSize?: number;
};
