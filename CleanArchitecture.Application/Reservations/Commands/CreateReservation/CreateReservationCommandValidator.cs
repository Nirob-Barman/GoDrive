using FluentValidation;

namespace CleanArchitecture.Application.Reservations.Commands.CreateReservation;

public class CreateReservationCommandValidator : AbstractValidator<CreateReservationCommand>
{
    public CreateReservationCommandValidator()
    {
        RuleFor(x => x.CarId).GreaterThan(0);

        RuleFor(x => x.PickupDate).GreaterThanOrEqualTo(DateTime.UtcNow)
            .WithMessage("Pickup date cannot be in the past.");

        RuleFor(x => x.DropoffDate).GreaterThan(x => x.PickupDate)
            .WithMessage("Drop-off date must be after the pickup date.");
    }
}
