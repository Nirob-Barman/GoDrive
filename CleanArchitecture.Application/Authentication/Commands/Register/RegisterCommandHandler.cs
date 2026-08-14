using CleanArchitecture.Application.Common.Exceptions;
using CleanArchitecture.Application.Common.Interfaces;
using MediatR;

namespace CleanArchitecture.Application.Authentication.Commands.Register;

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, RegisterResponse>
{
    private readonly IIdentityService _identityService;

    public RegisterCommandHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<RegisterResponse> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        if (await _identityService.IsEmailInUseAsync(request.Email, cancellationToken))
        {
            throw new ConflictException("An account with this email already exists.");
        }

        var result = await _identityService.CreateUserAsync(
            request.FullName,
            request.Email,
            request.Password,
            request.PhoneNumber,
            cancellationToken);

        if (!result.Succeeded || result.UserId is null)
        {
            throw new IdentityOperationException(result.Errors);
        }

        return new RegisterResponse(result.UserId, request.Email);
    }
}
