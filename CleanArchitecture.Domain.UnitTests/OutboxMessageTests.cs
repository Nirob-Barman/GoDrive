using CleanArchitecture.Domain.Entities;
using CleanArchitecture.Domain.Enums;
using FluentAssertions;

namespace CleanArchitecture.Domain.UnitTests;

public class OutboxMessageTests
{
    [Fact]
    public void Create_starts_pending()
    {
        var message = OutboxMessage.Create("ReservationApprovedEmail", "{}");

        message.Status.Should().Be(OutboxMessageStatus.Pending);
        message.RetryCount.Should().Be(0);
    }

    [Fact]
    public void MarkProcessed_sets_status_and_processed_time()
    {
        var message = OutboxMessage.Create("ReservationApprovedEmail", "{}");

        message.MarkProcessed();

        message.Status.Should().Be(OutboxMessageStatus.Processed);
        message.ProcessedAtUtc.Should().NotBeNull();
    }

    [Fact]
    public void MarkFailed_increments_retry_count_but_stays_pending_below_the_max()
    {
        var message = OutboxMessage.Create("ReservationApprovedEmail", "{}");

        message.MarkFailed("SMTP timeout", maxAttempts: 5);

        message.RetryCount.Should().Be(1);
        message.LastError.Should().Be("SMTP timeout");
        message.Status.Should().Be(OutboxMessageStatus.Pending);
    }

    [Fact]
    public void MarkFailed_moves_to_failed_once_max_attempts_reached()
    {
        var message = OutboxMessage.Create("ReservationApprovedEmail", "{}");

        for (var i = 0; i < 5; i++)
        {
            message.MarkFailed("SMTP timeout", maxAttempts: 5);
        }

        message.RetryCount.Should().Be(5);
        message.Status.Should().Be(OutboxMessageStatus.Failed);
    }
}
