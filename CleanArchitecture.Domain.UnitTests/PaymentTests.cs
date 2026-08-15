using CleanArchitecture.Domain.Entities;
using CleanArchitecture.Domain.Enums;
using FluentAssertions;

namespace CleanArchitecture.Domain.UnitTests;

public class PaymentTests
{
    [Fact]
    public void Create_starts_pending()
    {
        var payment = Payment.Create(1, "user-1", 240m, "usd", "cs_test_123");

        payment.Status.Should().Be(PaymentTransactionStatus.Pending);
        payment.PaidAtUtc.Should().BeNull();
    }

    [Fact]
    public void Create_throws_for_non_positive_amount()
    {
        var act = () => Payment.Create(1, "user-1", 0m, "usd", "cs_test_123");

        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void MarkSucceeded_records_the_payment_intent_and_paid_time()
    {
        var payment = Payment.Create(1, "user-1", 240m, "usd", "cs_test_123");

        payment.MarkSucceeded("pi_test_456");

        payment.Status.Should().Be(PaymentTransactionStatus.Succeeded);
        payment.StripePaymentIntentId.Should().Be("pi_test_456");
        payment.PaidAtUtc.Should().NotBeNull();
    }

    [Fact]
    public void MarkSucceeded_is_idempotent_against_repeat_webhook_delivery()
    {
        var payment = Payment.Create(1, "user-1", 240m, "usd", "cs_test_123");
        payment.MarkSucceeded("pi_test_456");
        var firstPaidAt = payment.PaidAtUtc;

        payment.MarkSucceeded("pi_test_different");

        payment.StripePaymentIntentId.Should().Be("pi_test_456");
        payment.PaidAtUtc.Should().Be(firstPaidAt);
    }

    [Fact]
    public void MarkFailed_does_not_downgrade_an_already_succeeded_payment()
    {
        var payment = Payment.Create(1, "user-1", 240m, "usd", "cs_test_123");
        payment.MarkSucceeded("pi_test_456");

        payment.MarkFailed();

        payment.Status.Should().Be(PaymentTransactionStatus.Succeeded);
    }

    [Fact]
    public void MarkFailed_marks_a_pending_payment_as_failed()
    {
        var payment = Payment.Create(1, "user-1", 240m, "usd", "cs_test_123");

        payment.MarkFailed();

        payment.Status.Should().Be(PaymentTransactionStatus.Failed);
    }
}
