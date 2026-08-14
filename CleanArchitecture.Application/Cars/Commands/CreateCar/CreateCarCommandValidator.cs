using FluentValidation;

namespace CleanArchitecture.Application.Cars.Commands.CreateCar;

public class CreateCarCommandValidator : AbstractValidator<CreateCarCommand>
{
    public CreateCarCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Brand).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Model).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Year).InclusiveBetween(1980, DateTime.UtcNow.Year + 1);
        RuleFor(x => x.CarType).IsInEnum();
        RuleFor(x => x.FuelType).IsInEnum();
        RuleFor(x => x.Transmission).IsInEnum();
        RuleFor(x => x.Seats).InclusiveBetween(1, 20);
        RuleFor(x => x.PricePerHour).GreaterThan(0);
        RuleFor(x => x.Location).NotEmpty().MaximumLength(200);
    }
}
