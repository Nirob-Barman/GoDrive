namespace CleanArchitecture.Application.Authentication.Commands.Login;

public record LoginResponse(
    string Token,
    DateTime ExpiresAtUtc,
    string UserId,
    string Email,
    string FullName,
    string Role);
