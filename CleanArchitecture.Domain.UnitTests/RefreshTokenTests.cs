using CleanArchitecture.Domain.Entities;
using FluentAssertions;

namespace CleanArchitecture.Domain.UnitTests;

public class RefreshTokenTests
{
    [Fact]
    public void Create_produces_an_active_token()
    {
        var token = RefreshToken.Create("user-1", "raw-token-value", DateTime.UtcNow.AddDays(7));

        token.IsActive.Should().BeTrue();
        token.RevokedAtUtc.Should().BeNull();
    }

    [Fact]
    public void IsActive_is_false_once_expired()
    {
        var token = RefreshToken.Create("user-1", "raw-token-value", DateTime.UtcNow.AddSeconds(-1));

        token.IsActive.Should().BeFalse();
    }

    [Fact]
    public void Revoke_marks_the_token_inactive_and_records_the_replacement()
    {
        var token = RefreshToken.Create("user-1", "raw-token-value", DateTime.UtcNow.AddDays(7));

        token.Revoke("new-token-value");

        token.IsActive.Should().BeFalse();
        token.RevokedAtUtc.Should().NotBeNull();
        token.ReplacedByToken.Should().Be("new-token-value");
    }

    [Fact]
    public void Revoke_is_idempotent_and_keeps_the_first_revocation()
    {
        var token = RefreshToken.Create("user-1", "raw-token-value", DateTime.UtcNow.AddDays(7));

        token.Revoke("first-replacement");
        var firstRevokedAt = token.RevokedAtUtc;
        token.Revoke("second-replacement");

        token.RevokedAtUtc.Should().Be(firstRevokedAt);
        token.ReplacedByToken.Should().Be("first-replacement");
    }
}
