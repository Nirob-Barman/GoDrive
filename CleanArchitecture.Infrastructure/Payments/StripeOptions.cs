namespace CleanArchitecture.Infrastructure.Payments;

public class StripeOptions
{
    public string PublishableKey { get; set; } = string.Empty;
    public string SecretKey { get; set; } = string.Empty;
    public string WebhookSecret { get; set; } = string.Empty;
    public string SuccessUrl { get; set; } = "https://example.com/payment-success?session_id={CHECKOUT_SESSION_ID}";
    public string CancelUrl { get; set; } = "https://example.com/payment-cancelled";
}
