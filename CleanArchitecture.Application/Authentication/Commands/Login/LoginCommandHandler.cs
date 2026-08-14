using CleanArchitecture.Application.Common.Interfaces;
using MediatR;

namespace CleanArchitecture.Application.Authentication.Commands.Login;

public class LoginCommandHandler : IRequestHandler<LoginCommand, LoginResponse>
{
    private readonly IIdentityService _identityService;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public LoginCommandHandler(IIdentityService identityService, IJwtTokenGenerator jwtTokenGenerator)
    {
        _identityService = identityService;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    public async Task<LoginResponse> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var result = await _identityService.AuthenticateAsync(request.Email, request.Password, cancellationToken);

        if (!result.Succeeded || result.UserId is null || result.Email is null || result.FullName is null || result.Role is null)
        {
            throw new UnauthorizedAccessException(result.Error ?? "Invalid email or password.");
        }

        var (token, expiresAtUtc) = _jwtTokenGenerator.GenerateToken(result.UserId, result.Email, result.Role);

        return new LoginResponse(token, expiresAtUtc, result.UserId, result.Email, result.FullName, result.Role);
    }
}
