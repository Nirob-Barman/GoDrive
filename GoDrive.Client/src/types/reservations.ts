export type TReservationStatus = "Pending" | "Approved" | "Rejected" | "Cancelled" | "PickedUp" | "Returned";
export type TPaymentStatus = "Unpaid" | "Paid" | "Refunded" | "Failed";

// Mirrors CleanArchitecture.Application.Reservations.Common.ReservationDto
export type TReservation = {
  id: number;
  carId: number;
  carName: string;
  pickupDate: string;
  dropoffDate: string;
  totalHours: number;
  pricePerHourAtBooking: number;
  totalAmount: number;
  status: TReservationStatus;
  paymentStatus: TPaymentStatus;
  rejectionReason: string | null;
  createdAtUtc: string;
  approvedAtUtc: string | null;
  rejectedAtUtc: string | null;
  cancelledAtUtc: string | null;
  pickedUpAtUtc: string | null;
  returnedAtUtc: string | null;
};

export type TCreateReservationRequest = {
  carId: number;
  pickupDate: string;
  dropoffDate: string;
};

export type TUpdateReservationRequest = {
  pickupDate: string;
  dropoffDate: string;
};

export type TMyReservationsFilters = {
  pageNumber?: number;
  pageSize?: number;
};

export type TAllReservationsFilters = {
  status?: TReservationStatus;
  pageNumber?: number;
  pageSize?: number;
};
