using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Domain.Entities;
using MediatR;

namespace CleanArchitecture.Application.Authentication.Commands.Login;

public class LoginCommandHandler : IRequestHandler<LoginCommand, LoginResponse>
{
    private readonly IIdentityService _identityService;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IApplicationDbContext _context;

    public LoginCommandHandler(IIdentityService identityService, IJwtTokenGenerator jwtTokenGenerator, IApplicationDbContext context)
    {
        _identityService = identityService;
        _jwtTokenGenerator = jwtTokenGenerator;
        _context = context;
    }

    public async Task<LoginResponse> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var result = await _identityService.AuthenticateAsync(request.Email, request.Password, cancellationToken);

        if (!result.Succeeded || result.UserId is null || result.Email is null || result.FullName is null || result.Role is null)
        {
            throw new UnauthorizedAccessException(result.Error ?? "Invalid email or password.");
        }

        var (accessToken, accessTokenExpiresAtUtc) = _jwtTokenGenerator.GenerateAccessToken(result.UserId, result.Email, result.Role);
        var (refreshTokenValue, refreshTokenExpiresAtUtc) = _jwtTokenGenerator.GenerateRefreshToken();

        _context.RefreshTokens.Add(RefreshToken.Create(result.UserId, refreshTokenValue, refreshTokenExpiresAtUtc));

        await _context.SaveChangesAsync(cancellationToken);

        return new LoginResponse(
            accessToken, accessTokenExpiresAtUtc,
            refreshTokenValue, refreshTokenExpiresAtUtc,
            result.UserId, result.Email, result.FullName, result.Role);
    }
}
