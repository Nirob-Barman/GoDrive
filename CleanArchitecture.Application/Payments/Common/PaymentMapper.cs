using CleanArchitecture.Domain.Entities;

namespace CleanArchitecture.Application.Payments.Common;

public static class PaymentMapper
{
    public static PaymentDto ToDto(Payment payment) => new(
        payment.Id,
        payment.ReservationId,
        payment.Amount,
        payment.Currency,
        payment.Status.ToString(),
        payment.CreatedAtUtc,
        payment.PaidAtUtc);
}
