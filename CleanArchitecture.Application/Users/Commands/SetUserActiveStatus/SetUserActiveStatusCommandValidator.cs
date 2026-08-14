using FluentValidation;

namespace CleanArchitecture.Application.Users.Commands.SetUserActiveStatus;

public class SetUserActiveStatusCommandValidator : AbstractValidator<SetUserActiveStatusCommand>
{
    public SetUserActiveStatusCommandValidator()
    {
        RuleFor(x => x.UserId).NotEmpty();
    }
}
