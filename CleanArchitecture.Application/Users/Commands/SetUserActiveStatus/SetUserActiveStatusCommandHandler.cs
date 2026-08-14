using CleanArchitecture.Application.Common.Exceptions;
using CleanArchitecture.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CleanArchitecture.Application.Users.Commands.SetUserActiveStatus;

public class SetUserActiveStatusCommandHandler : IRequestHandler<SetUserActiveStatusCommand>
{
    private readonly IIdentityService _identityService;
    private readonly IApplicationDbContext _context;

    public SetUserActiveStatusCommandHandler(IIdentityService identityService, IApplicationDbContext context)
    {
        _identityService = identityService;
        _context = context;
    }

    public async Task Handle(SetUserActiveStatusCommand request, CancellationToken cancellationToken)
    {
        var success = await _identityService.SetUserActiveStatusAsync(request.UserId, request.IsActive, cancellationToken);

        if (!success)
        {
            throw new NotFoundException("User", request.UserId);
        }

        if (!request.IsActive)
        {
            // Blocking an account should also kill its live sessions, not just future logins.
            var activeTokens = await _context.RefreshTokens
                .Where(rt => rt.UserId == request.UserId && rt.RevokedAtUtc == null)
                .ToListAsync(cancellationToken);

            foreach (var token in activeTokens)
            {
                token.Revoke();
            }

            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
