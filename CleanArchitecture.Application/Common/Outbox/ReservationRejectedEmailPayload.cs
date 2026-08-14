namespace CleanArchitecture.Application.Common.Outbox;

public record ReservationRejectedEmailPayload(
    string Email,
    string FullName,
    int ReservationId,
    string CarName,
    string? Reason);
