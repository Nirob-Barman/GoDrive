using CleanArchitecture.Application.Common.Constants;
using FluentValidation;

namespace CleanArchitecture.Application.Users.Commands.ChangeUserRole;

public class ChangeUserRoleCommandValidator : AbstractValidator<ChangeUserRoleCommand>
{
    public ChangeUserRoleCommandValidator()
    {
        RuleFor(x => x.UserId).NotEmpty();

        RuleFor(x => x.NewRole)
            .Must(role => role is Roles.Admin or Roles.User)
            .WithMessage($"Role must be '{Roles.Admin}' or '{Roles.User}'.");
    }
}
