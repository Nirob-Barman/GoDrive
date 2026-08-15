using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Application.Common.Models;
using CleanArchitecture.Infrastructure.Payments;
using Microsoft.Extensions.Options;

namespace CleanArchitecture.Api.IntegrationTests;

// Real Stripe checkout-session creation is faked (no network call to Stripe's API from automated tests),
// but webhook signature verification is delegated to the real implementation - that HMAC logic is ours
// and security-critical, so it deserves real coverage, not a stub.
public class TestPaymentService : IPaymentService
{
    private readonly StripePaymentService _real;

    public TestPaymentService(IOptions<StripeOptions> options)
    {
        _real = new StripePaymentService(options);
    }

    public Task<CheckoutSessionResult> CreateCheckoutSessionAsync(
        int reservationId, decimal amount, string currency, string customerEmail, CancellationToken cancellationToken)
    {
        return Task.FromResult(new CheckoutSessionResult(
            $"cs_test_fake_{reservationId}", "https://fake.checkout.test/session"));
    }

    public StripeWebhookResult ParseWebhookEvent(string requestBody, string signatureHeader) =>
        _real.ParseWebhookEvent(requestBody, signatureHeader);
}
