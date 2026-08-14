namespace CleanArchitecture.Application.Reservations.Common;

public record ReservationDto(
    int Id,
    int CarId,
    string CarName,
    DateTime PickupDate,
    DateTime DropoffDate,
    int TotalHours,
    decimal PricePerHourAtBooking,
    decimal TotalAmount,
    string Status,
    string PaymentStatus,
    string? RejectionReason,
    DateTime CreatedAtUtc,
    DateTime? ApprovedAtUtc,
    DateTime? RejectedAtUtc,
    DateTime? CancelledAtUtc,
    DateTime? PickedUpAtUtc,
    DateTime? ReturnedAtUtc);
