using CleanArchitecture.Application.Common.Exceptions;
using CleanArchitecture.Application.Common.Interfaces;
using MediatR;

namespace CleanArchitecture.Application.Users.Commands.ChangeUserRole;

public class ChangeUserRoleCommandHandler : IRequestHandler<ChangeUserRoleCommand>
{
    private readonly IIdentityService _identityService;
    private readonly ICurrentUserService _currentUser;

    public ChangeUserRoleCommandHandler(IIdentityService identityService, ICurrentUserService currentUser)
    {
        _identityService = identityService;
        _currentUser = currentUser;
    }

    public async Task Handle(ChangeUserRoleCommand request, CancellationToken cancellationToken)
    {
        if (request.UserId == _currentUser.UserId)
        {
            throw new ConflictException("You cannot change your own role.");
        }

        var success = await _identityService.ChangeUserRoleAsync(request.UserId, request.NewRole, cancellationToken);

        if (!success)
        {
            throw new NotFoundException("User", request.UserId);
        }
    }
}
