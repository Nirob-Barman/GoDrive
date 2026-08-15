namespace CleanArchitecture.Application.Common.Models;

public record StripeWebhookResult(
    bool IsCheckoutCompleted,
    bool IsPaymentFailed,
    string? SessionId,
    string? PaymentIntentId,
    int? ReservationId);
