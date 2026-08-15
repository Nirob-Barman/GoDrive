using FluentValidation;

namespace CleanArchitecture.Application.Payments.Commands.CreateCheckoutSession;

public class CreateCheckoutSessionCommandValidator : AbstractValidator<CreateCheckoutSessionCommand>
{
    public CreateCheckoutSessionCommandValidator()
    {
        RuleFor(x => x.ReservationId).GreaterThan(0);
    }
}
