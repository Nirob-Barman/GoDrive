using FluentValidation;

namespace CleanArchitecture.Application.Cars.Commands.AddCarImages;

public class AddCarImagesCommandValidator : AbstractValidator<AddCarImagesCommand>
{
    public AddCarImagesCommandValidator()
    {
        RuleFor(x => x.CarId).GreaterThan(0);
        RuleFor(x => x.Images).NotEmpty().WithMessage("At least one image is required.");
    }
}
