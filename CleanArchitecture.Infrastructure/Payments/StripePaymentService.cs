using CleanArchitecture.Application.Common.Exceptions;
using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Application.Common.Models;
using Microsoft.Extensions.Options;
using Stripe;
using Stripe.Checkout;

namespace CleanArchitecture.Infrastructure.Payments;

public class StripePaymentService : IPaymentService
{
    private readonly StripeOptions _options;

    public StripePaymentService(IOptions<StripeOptions> options)
    {
        _options = options.Value;
        StripeConfiguration.ApiKey = _options.SecretKey;
    }

    public async Task<CheckoutSessionResult> CreateCheckoutSessionAsync(
        int reservationId, decimal amount, string currency, string customerEmail, CancellationToken cancellationToken)
    {
        var createOptions = new SessionCreateOptions
        {
            Mode = "payment",
            PaymentMethodTypes = new List<string> { "card" },
            CustomerEmail = customerEmail,
            LineItems = new List<SessionLineItemOptions>
            {
                new()
                {
                    Quantity = 1,
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        Currency = currency,
                        UnitAmount = (long)(amount * 100),
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = $"GoDrive Reservation #{reservationId}"
                        }
                    }
                }
            },
            Metadata = new Dictionary<string, string>
            {
                ["reservationId"] = reservationId.ToString()
            },
            SuccessUrl = _options.SuccessUrl,
            CancelUrl = _options.CancelUrl
        };

        var service = new SessionService();
        var session = await service.CreateAsync(createOptions, cancellationToken: cancellationToken);

        return new CheckoutSessionResult(session.Id, session.Url);
    }

    public StripeWebhookResult ParseWebhookEvent(string requestBody, string signatureHeader)
    {
        Event stripeEvent;

        try
        {
            // throwOnApiVersionMismatch: false - the account's webhook API version and the SDK's version
            // can legitimately drift over time; that's not a signature problem and shouldn't reject the event.
            stripeEvent = EventUtility.ConstructEvent(
                requestBody, signatureHeader, _options.WebhookSecret, throwOnApiVersionMismatch: false);
        }
        catch (Exception ex)
        {
            // Public endpoint: parsing and signature verification is this method's whole job, so ANY failure
            // here (bad signature, malformed JSON, SDK edge cases) is a malformed/spoofed request, not a server fault.
            throw new InvalidWebhookSignatureException($"Invalid or malformed Stripe webhook payload: {ex.Message}");
        }

        if (stripeEvent.Type == EventTypes.CheckoutSessionCompleted && stripeEvent.Data.Object is Session session)
        {
            var reservationId = session.Metadata is not null
                && session.Metadata.TryGetValue("reservationId", out var value)
                && int.TryParse(value, out var id)
                    ? id
                    : (int?)null;

            return new StripeWebhookResult(true, false, session.Id, session.PaymentIntentId, reservationId);
        }

        if (stripeEvent.Type == EventTypes.PaymentIntentPaymentFailed && stripeEvent.Data.Object is PaymentIntent paymentIntent)
        {
            return new StripeWebhookResult(false, true, null, paymentIntent.Id, null);
        }

        return new StripeWebhookResult(false, false, null, null, null);
    }
}
