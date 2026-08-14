namespace CleanArchitecture.Domain.Enums;

public enum OutboxMessageStatus
{
    Pending,
    Processed,
    Failed
}
