namespace CleanArchitecture.Application.Common.Outbox;

public record PasswordResetEmailPayload(string Email, string FullName, string Token);
