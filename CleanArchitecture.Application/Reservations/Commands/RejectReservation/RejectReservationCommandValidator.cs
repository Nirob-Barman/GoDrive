using FluentValidation;

namespace CleanArchitecture.Application.Reservations.Commands.RejectReservation;

public class RejectReservationCommandValidator : AbstractValidator<RejectReservationCommand>
{
    public RejectReservationCommandValidator()
    {
        RuleFor(x => x.Reason).MaximumLength(1000);
    }
}
