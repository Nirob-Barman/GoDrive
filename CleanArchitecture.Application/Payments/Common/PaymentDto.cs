namespace CleanArchitecture.Application.Payments.Common;

public record PaymentDto(
    int Id,
    int ReservationId,
    decimal Amount,
    string Currency,
    string Status,
    DateTime CreatedAtUtc,
    DateTime? PaidAtUtc);
