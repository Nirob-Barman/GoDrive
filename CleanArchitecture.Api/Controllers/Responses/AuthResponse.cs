namespace CleanArchitecture.Api.Controllers.Responses;

// The client-facing half of LoginResponse - deliberately excludes RefreshToken/
// RefreshTokenExpiresAtUtc, which never leave the httpOnly cookie the controller sets.
public record AuthResponse(
    string Token,
    DateTime ExpiresAtUtc,
    string UserId,
    string Email,
    string FullName,
    string Role);
