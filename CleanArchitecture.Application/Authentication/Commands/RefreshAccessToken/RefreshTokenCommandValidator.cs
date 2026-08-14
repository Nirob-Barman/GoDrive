using FluentValidation;

namespace CleanArchitecture.Application.Authentication.Commands.RefreshAccessToken;

public class RefreshTokenCommandValidator : AbstractValidator<RefreshTokenCommand>
{
    public RefreshTokenCommandValidator()
    {
        RuleFor(x => x.RefreshToken).NotEmpty();
    }
}
