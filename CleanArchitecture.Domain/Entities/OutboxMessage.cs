using CleanArchitecture.Domain.Enums;

namespace CleanArchitecture.Domain.Entities;

public class OutboxMessage
{
    public int Id { get; private set; }
    public string Type { get; private set; } = string.Empty;
    public string Payload { get; private set; } = string.Empty;
    public OutboxMessageStatus Status { get; private set; }
    public DateTime CreatedAtUtc { get; private set; }
    public DateTime? ProcessedAtUtc { get; private set; }
    public int RetryCount { get; private set; }
    public string? LastError { get; private set; }

    private OutboxMessage()
    {
    }

    public static OutboxMessage Create(string type, string payload)
    {
        if (string.IsNullOrWhiteSpace(type))
        {
            throw new ArgumentException("Type is required.", nameof(type));
        }

        return new OutboxMessage
        {
            Type = type,
            Payload = payload,
            Status = OutboxMessageStatus.Pending,
            CreatedAtUtc = DateTime.UtcNow
        };
    }

    public void MarkProcessed()
    {
        Status = OutboxMessageStatus.Processed;
        ProcessedAtUtc = DateTime.UtcNow;
    }

    public void MarkFailed(string error, int maxAttempts)
    {
        RetryCount++;
        LastError = error;

        if (RetryCount >= maxAttempts)
        {
            Status = OutboxMessageStatus.Failed;
        }
    }
}
