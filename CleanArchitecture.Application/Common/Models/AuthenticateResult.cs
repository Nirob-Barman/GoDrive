namespace CleanArchitecture.Application.Common.Models;

public record AuthenticateResult(
    bool Succeeded,
    string? UserId,
    string? Email,
    string? FullName,
    string? Role,
    string? Error);
