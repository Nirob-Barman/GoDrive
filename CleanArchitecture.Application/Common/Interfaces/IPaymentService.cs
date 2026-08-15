using CleanArchitecture.Application.Common.Models;

namespace CleanArchitecture.Application.Common.Interfaces;

public interface IPaymentService
{
    Task<CheckoutSessionResult> CreateCheckoutSessionAsync(
        int reservationId, decimal amount, string currency, string customerEmail, CancellationToken cancellationToken);

    StripeWebhookResult ParseWebhookEvent(string requestBody, string signatureHeader);
}
