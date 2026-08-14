using System.Text.Json;
using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Application.Common.Outbox;
using CleanArchitecture.Domain.Entities;
using MediatR;

namespace CleanArchitecture.Application.Authentication.Commands.ForgotPassword;

public class ForgotPasswordCommandHandler : IRequestHandler<ForgotPasswordCommand>
{
    private readonly IIdentityService _identityService;
    private readonly IApplicationDbContext _context;

    public ForgotPasswordCommandHandler(IIdentityService identityService, IApplicationDbContext context)
    {
        _identityService = identityService;
        _context = context;
    }

    public async Task Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
    {
        var result = await _identityService.GeneratePasswordResetTokenAsync(request.Email, cancellationToken);

        // Never reveal whether the email exists - only queue an email when it does, but always return success.
        if (result is not null)
        {
            var payload = JsonSerializer.Serialize(new PasswordResetEmailPayload(result.Email, result.FullName, result.Token));
            _context.OutboxMessages.Add(OutboxMessage.Create(OutboxMessageTypes.PasswordResetEmail, payload));
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
