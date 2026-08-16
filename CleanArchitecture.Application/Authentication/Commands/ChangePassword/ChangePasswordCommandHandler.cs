using CleanArchitecture.Application.Common.Exceptions;
using CleanArchitecture.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CleanArchitecture.Application.Authentication.Commands.ChangePassword;

public class ChangePasswordCommandHandler : IRequestHandler<ChangePasswordCommand>
{
    private readonly IIdentityService _identityService;
    private readonly ICurrentUserService _currentUser;
    private readonly IApplicationDbContext _context;

    public ChangePasswordCommandHandler(
        IIdentityService identityService, ICurrentUserService currentUser, IApplicationDbContext context)
    {
        _identityService = identityService;
        _currentUser = currentUser;
        _context = context;
    }

    public async Task Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUser.UserId ?? throw new UnauthorizedAccessException();

        var result = await _identityService.ChangePasswordAsync(
            userId, request.CurrentPassword, request.NewPassword, cancellationToken);

        if (!result.Succeeded)
        {
            throw new IdentityOperationException(result.Errors);
        }

        // Changing the password invalidates every other session - force re-login elsewhere.
        // The caller's own current session is spared: they just proved they know the
        // (new) password, so there's no security reason to log this device out too.
        var activeTokens = await _context.RefreshTokens
            .Where(rt => rt.UserId == userId && rt.RevokedAtUtc == null && rt.Token != request.CurrentRefreshToken)
            .ToListAsync(cancellationToken);

        foreach (var token in activeTokens)
        {
            token.Revoke();
        }

        await _context.SaveChangesAsync(cancellationToken);
    }
}
