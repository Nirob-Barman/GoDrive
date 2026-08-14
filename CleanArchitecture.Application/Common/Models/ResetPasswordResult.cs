namespace CleanArchitecture.Application.Common.Models;

public record ResetPasswordResult(bool Succeeded, string? UserId, IReadOnlyCollection<string> Errors);
