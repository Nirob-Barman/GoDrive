using FluentValidation;

namespace CleanArchitecture.Application.Reservations.Commands.UpdateReservation;

public class UpdateReservationCommandValidator : AbstractValidator<UpdateReservationCommand>
{
    public UpdateReservationCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0);

        RuleFor(x => x.PickupDate).GreaterThanOrEqualTo(DateTime.UtcNow)
            .WithMessage("Pickup date cannot be in the past.");

        RuleFor(x => x.DropoffDate).GreaterThan(x => x.PickupDate)
            .WithMessage("Drop-off date must be after the pickup date.");
    }
}
