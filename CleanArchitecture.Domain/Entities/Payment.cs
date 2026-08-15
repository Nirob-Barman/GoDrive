using CleanArchitecture.Domain.Enums;

namespace CleanArchitecture.Domain.Entities;

public class Payment
{
    public int Id { get; private set; }
    public int ReservationId { get; private set; }
    public Reservation Reservation { get; private set; } = null!;
    public string UserId { get; private set; } = string.Empty;
    public decimal Amount { get; private set; }
    public string Currency { get; private set; } = "usd";
    public string? StripeSessionId { get; private set; }
    public string? StripePaymentIntentId { get; private set; }
    public PaymentTransactionStatus Status { get; private set; }
    public DateTime CreatedAtUtc { get; private set; }
    public DateTime? PaidAtUtc { get; private set; }

    private Payment()
    {
    }

    public static Payment Create(int reservationId, string userId, decimal amount, string currency, string stripeSessionId)
    {
        if (amount <= 0)
        {
            throw new ArgumentException("Amount must be greater than zero.", nameof(amount));
        }

        return new Payment
        {
            ReservationId = reservationId,
            UserId = userId,
            Amount = amount,
            Currency = currency,
            StripeSessionId = stripeSessionId,
            Status = PaymentTransactionStatus.Pending,
            CreatedAtUtc = DateTime.UtcNow
        };
    }

    public void MarkSucceeded(string paymentIntentId)
    {
        if (Status == PaymentTransactionStatus.Succeeded)
        {
            return;
        }

        Status = PaymentTransactionStatus.Succeeded;
        StripePaymentIntentId = paymentIntentId;
        PaidAtUtc = DateTime.UtcNow;
    }

    public void MarkFailed()
    {
        if (Status == PaymentTransactionStatus.Succeeded)
        {
            return;
        }

        Status = PaymentTransactionStatus.Failed;
    }
}
