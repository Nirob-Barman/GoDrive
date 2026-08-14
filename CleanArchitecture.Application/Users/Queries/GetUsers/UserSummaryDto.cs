namespace CleanArchitecture.Application.Users.Queries.GetUsers;

public record UserSummaryDto(
    string UserId,
    string FullName,
    string Email,
    string? PhoneNumber,
    bool IsActive,
    string Role);
