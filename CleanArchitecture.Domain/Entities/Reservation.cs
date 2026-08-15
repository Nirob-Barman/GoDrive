using CleanArchitecture.Domain.Enums;

namespace CleanArchitecture.Domain.Entities;

public class Reservation
{
    public int Id { get; private set; }
    public string UserId { get; private set; } = string.Empty;
    public int CarId { get; private set; }
    public Car Car { get; private set; } = null!;

    public DateTime PickupDate { get; private set; }
    public DateTime DropoffDate { get; private set; }
    public decimal PricePerHourAtBooking { get; private set; }
    public int TotalHours { get; private set; }
    public decimal TotalAmount { get; private set; }

    public ReservationStatus Status { get; private set; }
    public PaymentStatus PaymentStatus { get; private set; }
    public string? RejectionReason { get; private set; }

    public DateTime CreatedAtUtc { get; private set; }
    public DateTime? ApprovedAtUtc { get; private set; }
    public DateTime? RejectedAtUtc { get; private set; }
    public DateTime? CancelledAtUtc { get; private set; }
    public DateTime? PickedUpAtUtc { get; private set; }
    public DateTime? ReturnedAtUtc { get; private set; }

    private Reservation()
    {
    }

    public static Reservation Create(string userId, int carId, decimal pricePerHour, DateTime pickupDate, DateTime dropoffDate)
    {
        if (string.IsNullOrWhiteSpace(userId))
        {
            throw new ArgumentException("UserId is required.", nameof(userId));
        }

        if (dropoffDate <= pickupDate)
        {
            throw new ArgumentException("Drop-off date must be after the pickup date.", nameof(dropoffDate));
        }

        var totalHours = (int)Math.Ceiling((dropoffDate - pickupDate).TotalHours);

        return new Reservation
        {
            UserId = userId,
            CarId = carId,
            PickupDate = pickupDate,
            DropoffDate = dropoffDate,
            PricePerHourAtBooking = pricePerHour,
            TotalHours = totalHours,
            TotalAmount = totalHours * pricePerHour,
            Status = ReservationStatus.Pending,
            PaymentStatus = PaymentStatus.Unpaid,
            CreatedAtUtc = DateTime.UtcNow
        };
    }

    public void Reschedule(DateTime pickupDate, DateTime dropoffDate)
    {
        if (Status != ReservationStatus.Pending)
        {
            throw new InvalidOperationException("Only a pending reservation can be modified.");
        }

        if (dropoffDate <= pickupDate)
        {
            throw new ArgumentException("Drop-off date must be after the pickup date.", nameof(dropoffDate));
        }

        PickupDate = pickupDate;
        DropoffDate = dropoffDate;
        TotalHours = (int)Math.Ceiling((dropoffDate - pickupDate).TotalHours);
        TotalAmount = TotalHours * PricePerHourAtBooking;
    }

    public void Approve()
    {
        if (Status != ReservationStatus.Pending)
        {
            throw new InvalidOperationException("Only a pending reservation can be approved.");
        }

        Status = ReservationStatus.Approved;
        ApprovedAtUtc = DateTime.UtcNow;
    }

    public void Reject(string? reason)
    {
        if (Status != ReservationStatus.Pending)
        {
            throw new InvalidOperationException("Only a pending reservation can be rejected.");
        }

        Status = ReservationStatus.Rejected;
        RejectionReason = reason;
        RejectedAtUtc = DateTime.UtcNow;
    }

    public void Cancel()
    {
        if (Status != ReservationStatus.Pending)
        {
            throw new InvalidOperationException("Only a pending reservation can be cancelled.");
        }

        Status = ReservationStatus.Cancelled;
        CancelledAtUtc = DateTime.UtcNow;
    }

    public void MarkPaid()
    {
        PaymentStatus = PaymentStatus.Paid;
    }

    public void MarkPickedUp()
    {
        if (Status != ReservationStatus.Approved)
        {
            throw new InvalidOperationException("Only an approved reservation can be marked picked up.");
        }

        if (PaymentStatus != PaymentStatus.Paid)
        {
            throw new InvalidOperationException("Payment must be completed before pickup.");
        }

        Status = ReservationStatus.PickedUp;
        PickedUpAtUtc = DateTime.UtcNow;
    }

    public void MarkReturned()
    {
        if (Status != ReservationStatus.PickedUp)
        {
            throw new InvalidOperationException("Only a picked-up reservation can be marked returned.");
        }

        Status = ReservationStatus.Returned;
        ReturnedAtUtc = DateTime.UtcNow;
    }
}
