namespace CleanArchitecture.Application.Common.Outbox;

public record ReservationApprovedEmailPayload(
    string Email,
    string FullName,
    int ReservationId,
    string CarName,
    decimal TotalAmount);
