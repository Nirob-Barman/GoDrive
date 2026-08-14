using CleanArchitecture.Application.Authentication.Commands.Login;
using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CleanArchitecture.Application.Authentication.Commands.RefreshAccessToken;

public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, LoginResponse>
{
    private readonly IApplicationDbContext _context;
    private readonly IIdentityService _identityService;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public RefreshTokenCommandHandler(
        IApplicationDbContext context, IIdentityService identityService, IJwtTokenGenerator jwtTokenGenerator)
    {
        _context = context;
        _identityService = identityService;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    public async Task<LoginResponse> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        var existing = await _context.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == request.RefreshToken, cancellationToken);

        if (existing is null || !existing.IsActive)
        {
            throw new UnauthorizedAccessException("Invalid or expired refresh token.");
        }

        var profile = await _identityService.GetProfileAsync(existing.UserId, cancellationToken);

        if (profile is null || !profile.IsActive)
        {
            throw new UnauthorizedAccessException("Invalid or expired refresh token.");
        }

        var (accessToken, accessTokenExpiresAtUtc) =
            _jwtTokenGenerator.GenerateAccessToken(profile.UserId, profile.Email, profile.Role);
        var (newRefreshTokenValue, newRefreshTokenExpiresAtUtc) = _jwtTokenGenerator.GenerateRefreshToken();

        existing.Revoke(newRefreshTokenValue);

        _context.RefreshTokens.Add(RefreshToken.Create(profile.UserId, newRefreshTokenValue, newRefreshTokenExpiresAtUtc));

        await _context.SaveChangesAsync(cancellationToken);

        return new LoginResponse(
            accessToken, accessTokenExpiresAtUtc,
            newRefreshTokenValue, newRefreshTokenExpiresAtUtc,
            profile.UserId, profile.Email, profile.FullName, profile.Role);
    }
}
