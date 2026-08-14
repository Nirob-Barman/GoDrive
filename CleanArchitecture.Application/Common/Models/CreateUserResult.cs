namespace CleanArchitecture.Application.Common.Models;

public record CreateUserResult(bool Succeeded, string? UserId, IReadOnlyCollection<string> Errors);
