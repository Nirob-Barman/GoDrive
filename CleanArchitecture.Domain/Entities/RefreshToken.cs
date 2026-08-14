namespace CleanArchitecture.Domain.Entities;

public class RefreshToken
{
    public int Id { get; private set; }
    public string UserId { get; private set; } = string.Empty;
    public string Token { get; private set; } = string.Empty;
    public DateTime CreatedAtUtc { get; private set; }
    public DateTime ExpiresAtUtc { get; private set; }
    public DateTime? RevokedAtUtc { get; private set; }
    public string? ReplacedByToken { get; private set; }

    private RefreshToken()
    {
    }

    public static RefreshToken Create(string userId, string token, DateTime expiresAtUtc)
    {
        if (string.IsNullOrWhiteSpace(userId))
        {
            throw new ArgumentException("UserId is required.", nameof(userId));
        }

        if (string.IsNullOrWhiteSpace(token))
        {
            throw new ArgumentException("Token is required.", nameof(token));
        }

        return new RefreshToken
        {
            UserId = userId,
            Token = token,
            CreatedAtUtc = DateTime.UtcNow,
            ExpiresAtUtc = expiresAtUtc
        };
    }

    public bool IsActive => RevokedAtUtc is null && DateTime.UtcNow < ExpiresAtUtc;

    public void Revoke(string? replacedByToken = null)
    {
        if (RevokedAtUtc is not null)
        {
            return;
        }

        RevokedAtUtc = DateTime.UtcNow;
        ReplacedByToken = replacedByToken;
    }
}
