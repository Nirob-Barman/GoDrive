namespace CleanArchitecture.Application.Common.Models;

public record UserSummaryResult(
    string UserId,
    string FullName,
    string Email,
    string? PhoneNumber,
    bool IsActive,
    string Role);
