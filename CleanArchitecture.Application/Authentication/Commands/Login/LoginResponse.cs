namespace CleanArchitecture.Application.Authentication.Commands.Login;

public record LoginResponse(
    string Token,
    DateTime ExpiresAtUtc,
    string RefreshToken,
    DateTime RefreshTokenExpiresAtUtc,
    string UserId,
    string Email,
    string FullName,
    string Role);
