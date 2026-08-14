namespace CleanArchitecture.Application.Common.Interfaces;

public interface IJwtTokenGenerator
{
    (string Token, DateTime ExpiresAtUtc) GenerateAccessToken(string userId, string email, string role);

    (string Token, DateTime ExpiresAtUtc) GenerateRefreshToken();
}
