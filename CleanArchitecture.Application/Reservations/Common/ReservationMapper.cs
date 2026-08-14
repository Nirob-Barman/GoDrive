using CleanArchitecture.Domain.Entities;

namespace CleanArchitecture.Application.Reservations.Common;

public static class ReservationMapper
{
    public static ReservationDto ToDto(Reservation r) => new(
        r.Id,
        r.CarId,
        r.Car.Name,
        r.PickupDate,
        r.DropoffDate,
        r.TotalHours,
        r.PricePerHourAtBooking,
        r.TotalAmount,
        r.Status.ToString(),
        r.PaymentStatus.ToString(),
        r.RejectionReason,
        r.CreatedAtUtc,
        r.ApprovedAtUtc,
        r.RejectedAtUtc,
        r.CancelledAtUtc,
        r.PickedUpAtUtc,
        r.ReturnedAtUtc);
}
